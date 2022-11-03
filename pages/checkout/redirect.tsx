/* eslint-disable camelcase */
import { Button, Icon, Typography } from "@equinor/eds-core-react"
import { external_link } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { getToken } from "next-auth/jwt"
import type { NextPage, GetServerSideProps } from "next/types"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { CheckoutWizard, NoAsset, formatCheckoutTitle } from "components/CheckoutWizard"
import { Page } from "components/Page"
import { config } from "config"
import { useCheckoutData } from "hooks"
import { ClientError, ERR_CODES, ExternalError } from "lib/errors"
import { __Error__ } from "lib/errors/__Error__"
import { Asset } from "model/Asset"
import { makeCollibraService } from "services"
import { getAssetByID, getRightsToUse } from "services/collibra"

const StyledButton = styled(Button)`
  margin-top: ${tokens.spacings.comfortable.x_large};
`

type Props = {
  asset?: Collibra.Asset | null
  error?: string
  authorizationUrl?: {
    value: string
  }
}

const CheckoutRedirectView: NextPage<Props> = ({ authorizationUrl }) => {
  const intl = useIntl()
  const { checkoutData } = useCheckoutData()

  const checkoutUrl = authorizationUrl?.value || config.ACCESSIT_BASE_URL

  return (
    <Page
      documentTitle={formatCheckoutTitle(
        intl.formatMessage({ id: "checkout.prefix.title" }),
        intl.formatMessage({ id: "checkout.nav.step.redirect" })
      )}
    >
      <main>
        <CheckoutWizard assetName={checkoutData.asset?.name}>
          {!checkoutData.asset ? (
            <NoAsset />
          ) : (
            <>
              <Typography variant="ingress">{intl.formatMessage({ id: "checkout.redirect.headline" })}</Typography>
              <StyledButton link href={checkoutUrl} target="_blank" rel="noopener noreferrer nofollow">
                {intl.formatMessage({ id: "checkout.redirect.button.text" })}
                <Icon data={external_link} />
              </StyledButton>
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
    return { props: defaultPageProps }
  }

  const authorization = `Bearer ${token!.accessToken}`
  const makeCollibraServiceRequest = makeCollibraService({ authorization })

  try {
    const asset = await makeCollibraServiceRequest(getAssetByID)(id)

    if (!asset.approved || !Asset.isDataProduct(asset)) {
      throw new ClientError(`Data product ${id} not approved`, ERR_CODES.ASSET_NOT_APPROVED)
    }

    const rtuAttrs = await makeCollibraServiceRequest(getRightsToUse)(id)
    const authorizationUrl = rtuAttrs.find((attr) => attr.type.toLowerCase() === "authorization url")

    if (!authorizationUrl) {
      throw new ExternalError(`No authorization URL found for ${asset.name} (ID: ${asset.id})`, ERR_CODES.MISSING_DATA)
    }

    return {
      props: {
        asset: JSON.parse(JSON.stringify(asset)),
        authorizationUrl: {
          value: authorizationUrl.value,
        },
      },
    }
  } catch (error) {
    console.error("[CheckoutRedirectView]", error)

    // if (error instanceof ExternalError || error instanceof ClientError) {
    if (error instanceof __Error__) {
      return {
        props: {
          ...defaultPageProps,
          error: error.code,
        },
      }
    }

    return {
      props: defaultPageProps,
    }
  }
}

export default CheckoutRedirectView
