/* eslint-disable camelcase */
import {
  Banner,
  Button,
  Checkbox,
  Icon,
  Typography,
} from "@equinor/eds-core-react"
import { warning_filled } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { GetServerSideProps, NextPage } from "next"
import { getToken } from "next-auth/jwt"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"
import xss from "xss"

import {
  CheckoutWizard,
  NoAsset,
  CancelButton,
  ValidationError,
  formatCheckoutTitle,
} from "components/CheckoutWizard"
import { Page } from "components/Page"
import { config } from "config"
import { useCheckoutData } from "hooks/useCheckoutData"
import { HttpClient } from "lib/HttpClient"
import { ERR_CODES, ExternalError } from "lib/errors"

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
  margin-bottom: ${tokens.spacings.comfortable.medium}
`

const DataSourceErrorContainer = styled.div`
  > *:not(:last-child) {
    margin-bottom: ${tokens.spacings.comfortable.medium};
  }
`

type Props = {
  asset?: Collibra.Asset | null
  error?: string
  rightsToUse?: {
    name: string
    value: string
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
        pathname: "/checkout/access",
        query: { id: asset?.id },
      })
    } else {
      setFormError(true)
    }
  }

  const onAcceptTerms = () => {
    setCheckoutData({
      ...checkoutData,
      asset: {
        ...(checkoutData.asset ?? {}),
        id: asset?.id ?? "",
        name: asset?.name ?? "",
      },
      terms: { ...checkoutData.terms, termsAccepted: !hasAcceptedTerms },
    })
  }

  return (
    <Page documentTitle={formatCheckoutTitle(intl.formatMessage({ id: "checkout.prefix.title" }), intl.formatMessage({ id: "checkout.nav.step.terms" }))}>
      <main>
        <CheckoutWizard assetName={asset?.name}>
          {(!error && asset?.id
            && (
              <>
                <IngressContainer>
                  <FormattedMessage
                    id="terms.ingress"
                    // eslint-disable-next-line react/no-unstable-nested-components
                    values={{ p: (chunks) => <Typography variant="ingress">{chunks}</Typography> }}
                  />
                </IngressContainer>
                <InfoBox>
                  <Typography variant="h5" as="h2">{rightsToUse?.name}</Typography>
                  <Typography dangerouslySetInnerHTML={{ __html: rightsToUse?.value! }} />
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
                  {formError && <ValidationError>{intl.formatMessage({ id: "terms.accept.errorMessage" })}</ValidationError> }
                </CheckboxContainer>
                <ButtonContainer>
                  <CancelButton assetId={asset?.id} />
                  <Button
                    onClick={onContinue}
                  >
                    {intl.formatMessage({ id: "common.continue" })}
                  </Button>
                </ButtonContainer>
              </>
            )
          ) }
          {!asset?.id && <NoAsset />}
          {error && (
            <DataSourceErrorContainer>
              <Banner>
                <Banner.Icon variant="warning">
                  <Icon data={warning_filled} />
                </Banner.Icon>
                <Banner.Message>
                  {intl.formatMessage({ id: `terms.error.${error}.bannerMessage`, defaultMessage: "We were unable to get the necessary data from Collibra" })}
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
  const defaultPageProps: Props = { asset: null }
  const token = await getToken({ req })
  const authorization = `Bearer ${token!.accessToken}`

  try {
    const { body: dataProduct } = await HttpClient.get<Collibra.Asset>(`${config.COLLIBRA_BASE_URL}/assets/${id}`, {
      headers: { authorization },
    })

    if (!dataProduct || !dataProduct.domain.name) {
      throw new ExternalError(`No data product or domain name found for ${id}`, ERR_CODES.MISSING_DATA)
    }

    const { body: domain } = await HttpClient.get<Collibra.PagedResponse>(`${config.COLLIBRA_BASE_URL}/domains`, {
      headers: { authorization },
      query: {
        name: `${dataProduct.domain.name.split(" ")[0]} - rights-to-use`,
        nameMatchMode: "ANYWHERE",
      },
    })

    if (!domain || domain.total === 0) {
      throw new ExternalError(`No rights-to-use domain found for ${dataProduct.domain.name}`, ERR_CODES.MISSING_DATA)
    }

    const { body: statuses } = await HttpClient.get<Collibra.PagedResponse>(`${config.COLLIBRA_BASE_URL}/statuses`, {
      headers: { authorization },
      query: {
        name: "approved",
        nameMatchMode: "ANYWHERE",
      },
    })

    if (!statuses || statuses.total === 0) {
      throw new ExternalError("No status ID found for `Approved` status", ERR_CODES.MISSING_DATA)
    }

    const approvedStatusID = statuses.results[0].id

    const { body: rtuAssets } = await HttpClient.get<Collibra.PagedAssetResponse>(`${config.COLLIBRA_BASE_URL}/assets`, {
      headers: { authorization },
      query: {
        domainId: domain!.results[0].id,
        statusId: approvedStatusID,
      },
    })

    if (!rtuAssets || rtuAssets.total === 0) {
      throw new ExternalError(`No rights-to-use asset found in domain ${domain.results[0].name} (ID: ${domain.results[0].id})`, ERR_CODES.MISSING_DATA)
    }

    const { body: attributes } = await HttpClient.get<Collibra.PagedAttributeResponse>(`${config.COLLIBRA_BASE_URL}/attributes`, {
      headers: { authorization },
      query: { assetId: rtuAssets!.results[0].id },
    })

    if (!attributes || attributes.total === 0) {
      throw new ExternalError(`No attributes found for rights to use asset ${rtuAssets.results[0].name} (ID: ${rtuAssets.results[0].id})`, ERR_CODES.MISSING_DATA)
    }

    const terms = attributes.results.find((attr) => /terms and conditions/i.test(attr.type.name!))

    if (!terms) {
      throw new ExternalError(`No terms and conditions found for rights to use asset ${rtuAssets.results[0].name} (ID: ${rtuAssets.results[0].id})`, ERR_CODES.MISSING_DATA)
    }

    return {
      props: {
        asset: dataProduct,
        rightsToUse: {
          name: terms.asset.name,
          value: xss(terms.value),
        },
      },
    }
  } catch (error) {
    console.error("[CheckoutTermsView]", error)

    if (error instanceof ExternalError) {
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

export default CheckoutTermsView
