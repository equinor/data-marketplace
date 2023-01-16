/* eslint-disable camelcase */
import type { Asset, RightsToUse } from "@equinor/data-marketplace-models"
import { Button, Icon, Typography } from "@equinor/eds-core-react"
import { external_link } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import axios from "axios"
import { JSDOM } from "jsdom"
import { getToken } from "next-auth/jwt"
import type { NextPage, GetServerSideProps } from "next/types"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled-components"
import xss from "xss"

import { appInsights } from "appInsights"
import { CheckoutWizard, NoAsset, CancelButton, formatCheckoutTitle } from "components/CheckoutWizard"
import { Page } from "components/Page"
import { config } from "config"

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${tokens.spacings.comfortable.x_large};
  > *:not(:last-child) {
    margin-right: 1rem;
  }
`

type Props = {
  asset?: Asset | null
  error?: string
  authorizationUrl?: {
    value: string
  }
}

const getAccessitTitle = (url: string | undefined) => {
  const fallbackText = "[Missing title]"
  if (!url) return fallbackText

  const params = new URL(url).searchParams
  const term = params.get("term")

  return (term && decodeURI(term).replaceAll(/\+/g, " ")) || fallbackText
}

const CheckoutRedirectView: NextPage<Props> = ({ asset, authorizationUrl }) => {
  const intl = useIntl()

  const checkoutUrl = authorizationUrl?.value || (config.ACCESSIT_BASE_URL as string)
  const accessitTitle = getAccessitTitle(authorizationUrl?.value)

  const onAccessItRedirectClick = () => {
    appInsights.trackEvent({
      name: "Access IT redirect click",
      properties: { checkoutUrl, assetId: asset?.id, assetName: asset?.name },
    })
  }

  return (
    <Page
      documentTitle={formatCheckoutTitle(
        intl.formatMessage({ id: "checkout.prefix.title" }),
        intl.formatMessage({ id: "checkout.nav.step.redirect" })
      )}
    >
      <main>
        <CheckoutWizard assetName={asset?.name}>
          {!asset ? (
            <NoAsset />
          ) : (
            <>
              <Typography variant="ingress">{intl.formatMessage({ id: "checkout.redirect.headline" })}</Typography>
              <Typography style={{ marginTop: tokens.spacings.comfortable.x_large }} variant="ingress">
                <FormattedMessage
                  id="checkout.redirect.accessit.guidance"
                  values={{
                    accessitTitle: <b>{accessitTitle}</b>,
                  }}
                />
              </Typography>
              <ButtonContainer>
                <CancelButton assetId={asset?.id} />
                <Button
                  link
                  href={checkoutUrl}
                  onClick={onAccessItRedirectClick}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <FormattedMessage id="checkout.redirect.button.text" />
                  <Icon data={external_link} />
                </Button>
              </ButtonContainer>
            </>
          )}
        </CheckoutWizard>
      </main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id } = query
  const defaultPageProps: Props = { asset: null }

  if (typeof id !== "string") {
    return { props: defaultPageProps }
  }

  const token = await getToken({ req })

  if (typeof token?.accessToken !== "string") {
    return {
      props: defaultPageProps,
    }
  }

  const adapterServiceClient = axios.create({
    baseURL: (config.ADAPTER_SERVICE_API_URL as string) ?? "",
    headers: {
      authorization: `Bearer ${token.accessToken}`,
    },
    params: {
      code: config.ADAPTER_SERVICE_APP_KEY,
    },
  })

  try {
    const { data: asset } = await adapterServiceClient.get<Asset>(`/assets/${id}`)
    const { data: rightsToUseAttributes } = await adapterServiceClient.get<RightsToUse>(`/assets/${id}/terms`)

    const authUrl = rightsToUseAttributes.authURL?.value as string

    const authUrlHref = authUrl.includes("href")
      ? new JSDOM(xss(authUrl)).window.document.querySelector("a")?.getAttribute("href")
      : authUrl

    return {
      props: {
        asset: JSON.parse(JSON.stringify(asset)),
        authorizationUrl: {
          value: authUrlHref,
        },
      },
    }
  } catch (error) {
    console.error(`[CheckoutRedirectView] in getServerSideProps for asset ${id}`, error)

    return {
      props: defaultPageProps,
    }
  }
}

export default CheckoutRedirectView
