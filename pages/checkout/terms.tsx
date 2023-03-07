/* eslint-disable camelcase */
import type { Asset, RightsToUse } from "@equinor/data-marketplace-models"
import { Banner, Button, Checkbox, Icon, Typography } from "@equinor/eds-core-react"
import { warning_filled, chevron_right } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { PortableText } from "@portabletext/react"
import { PortableTextBlock } from "@portabletext/types"
import type { GetServerSideProps, NextPage } from "next"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { CheckoutWizard, NoAsset, CancelButton, ValidationError, formatCheckoutTitle } from "components/CheckoutWizard"
import { Page } from "components/Page"
import { Heading } from "components/Typography"
import { config } from "config"
import { useCheckoutData } from "hooks/useCheckoutData"
import { defaultComponents } from "htmlParsing/portableText"
import { ERR_CODES } from "lib/errors"
import { request } from "lib/net/request"

const IngressContainer = styled.div`
  margin-bottom: 1.5rem;

  p:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const CheckboxContainer = styled.div`
  margin-bottom: 1.5rem;

  label {
    position: relative;
    left: -12px;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`

const InfoBox = styled.div`
  background-color: ${tokens.colors.ui.background__info.hex};
  padding: ${tokens.spacings.comfortable.medium};
  margin-bottom: ${tokens.spacings.comfortable.medium};
`

const DataSourceErrorContainer = styled.div`
  > *:not(:last-child) {
    margin-bottom: ${tokens.spacings.comfortable.medium};
  }
`

type Props = {
  asset?: Asset | null
  error?: string
  rightsToUse?: {
    name: string
    value: string | PortableTextBlock[]
  }
}

const CheckoutTermsView: NextPage<Props> = ({ asset, error, rightsToUse }) => {
  const intl = useIntl()
  const router = useRouter()
  const [formError, setFormError] = useState(false)
  const { checkoutData, setCheckoutData } = useCheckoutData()

  const hasAcceptedTerms = checkoutData?.terms?.termsAccepted

  const onContinue = () => {
    if (hasAcceptedTerms) {
      setFormError(false)
      router.push({
        pathname: "/checkout/redirect",
        query: { id: asset?.id },
      })
    } else {
      setFormError(true)
    }
  }

  const onAcceptTerms = () => {
    setCheckoutData({
      ...checkoutData,
      terms: { ...checkoutData.terms, termsAccepted: !hasAcceptedTerms },
    })
  }

  return (
    <Page
      documentTitle={formatCheckoutTitle(
        intl.formatMessage({ id: "checkout.prefix.title" }),
        intl.formatMessage({ id: "checkout.nav.step.terms" })
      )}
    >
      <main>
        <CheckoutWizard assetName={asset?.name} communityName={asset?.community.name}>
          {!error && asset && (
            <>
              <IngressContainer>
                <FormattedMessage
                  id="terms.ingress"
                  // eslint-disable-next-line react/no-unstable-nested-components
                  values={{ p: (chunks) => <Typography variant="ingress">{chunks}</Typography> }}
                />
              </IngressContainer>
              <InfoBox>
                <Heading size="lg" level="h2">
                  {rightsToUse?.name}
                </Heading>
                {/*  @ts-ignore: Sorry Petter, cannot figure out this */}
                <PortableText value={rightsToUse.value} components={defaultComponents} />
              </InfoBox>
              <CheckboxContainer>
                <Checkbox
                  name="acceptTerms"
                  label={intl.formatMessage({ id: "terms.acceptLabel" })}
                  onChange={onAcceptTerms}
                  checked={hasAcceptedTerms ?? false}
                  aria-invalid={hasAcceptedTerms ? "false" : "true"}
                  aria-required
                />
                {formError && (
                  <ValidationError>{intl.formatMessage({ id: "terms.accept.errorMessage" })}</ValidationError>
                )}
              </CheckboxContainer>
              <ButtonContainer>
                <CancelButton assetId={asset?.id} />
                <Button onClick={onContinue}>
                  {intl.formatMessage({ id: "common.continue" })}
                  <Icon data={chevron_right} />
                </Button>
              </ButtonContainer>
            </>
          )}
          {!asset && !error && <NoAsset />}
          {error && (
            <DataSourceErrorContainer>
              <Banner>
                <Banner.Icon variant="warning">
                  <Icon data={warning_filled} />
                </Banner.Icon>
                <Banner.Message>
                  {intl.formatMessage({
                    id: `terms.error.${error}.bannerMessage`,
                    defaultMessage: "We were unable to get the necessary data from Collibra",
                  })}
                </Banner.Message>
              </Banner>

              {error.endsWith(ERR_CODES.MISSING_DATA) && (
                <Typography variant="body_short">
                  {intl.formatMessage({ id: `terms.error.${error}.additional` })}
                </Typography>
              )}
            </DataSourceErrorContainer>
          )}
        </CheckoutWizard>
      </main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id } = query

  const defaultPageProps: Props = {
    asset: null,
  }

  try {
    const assetRes = await request(
      `${config.ADAPTER_SERVICE_API_URL}/assets/${id}?code=${config.ADAPTER_SERVICE_APP_KEY}`,
      { retries: 3 }
    )({ req })
    const asset: Asset = await assetRes.json()

    const rtuRes = await request(
      `${config.ADAPTER_SERVICE_API_URL}/assets/${id}/terms?code=${config.ADAPTER_SERVICE_APP_KEY}`,
      { retries: 3 }
    )({ req })
    const rtu: RightsToUse = await rtuRes.json()

    const { terms } = rtu

    return {
      props: {
        asset,
        rightsToUse: {
          name: terms.name,
          value: terms.value,
        },
      },
    }
  } catch (error) {
    /* eslint-disable no-console */
    console.error(`[CheckoutTermsView] in getServerSideProps for asset ${id}`, error)

    return {
      props: defaultPageProps,
    }
  }
}

export default CheckoutTermsView
