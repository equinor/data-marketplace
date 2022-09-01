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
import React, { useCallback, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"
import xss from "xss"

import {
  CheckoutWizard,
  NoAsset,
  CancelButton,
  ValidationError,
} from "components/CheckoutWizard"
import { Container } from "components/Container"
import { Footer } from "components/Footer"
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

type Props = {
  asset?: Collibra.Asset | null
  error?: { code: string, message: string }
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

  useEffect(() => {
    if (asset) {
      setCheckoutData({ asset: { id: asset.id, name: asset.name } })
    }
  }, [asset])

  const ViewContent = useCallback(() => {
    if (error) {
      return (
        <Banner>
          <Banner.Icon variant="warning">
            <Icon data={warning_filled} />
          </Banner.Icon>
          <Banner.Message>
            {error.message}
          </Banner.Message>
        </Banner>
      )
    }

    if (!asset?.id) {
      return <NoAsset />
    }

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
          id: asset?.id ?? "",
          name: asset?.name ?? "",
        },
        terms: { ...checkoutData.terms, termsAccepted: !hasAcceptedTerms },
      })
    }

    return (
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
  }, [
    error,
    asset,
    formError,
    hasAcceptedTerms,
    rightsToUse,
    checkoutData,
  ])

  return (
    <>
      <Container>
        <CheckoutWizard assetName={checkoutData.asset?.name}>
          <ViewContent />
        </CheckoutWizard>
      </Container>
      <Footer />
    </>
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
      throw new ExternalError(
        "There was an error while trying to get information about this data product",
        ERR_CODES.MISSING_DATA,
        `No data product or domain name found for ${id}`,
      )
    }

    const { body: domain } = await HttpClient.get<Collibra.PagedResponse>(`${config.COLLIBRA_BASE_URL}/domains`, {
      headers: { authorization },
      query: {
        name: `${dataProduct.domain.name.split(" ")[0]} - rights-to-use`,
        nameMatchMode: "ANYWHERE",
      },
    })

    if (!domain || domain.total === 0) {
      throw new ExternalError(
        "There was an error while trying to get the Terms and Conditions",
        ERR_CODES.MISSING_DATA,
        `No rights-to-use domain found for ${dataProduct.domain.name}`,
      )
    }

    const { body: statuses } = await HttpClient.get<Collibra.PagedResponse>(`${config.COLLIBRA_BASE_URL}/statuses`, {
      headers: { authorization },
      query: {
        name: "approved",
        nameMatchMode: "ANYWHERE",
      },
    })

    if (!statuses || statuses.total === 0) {
      throw new ExternalError(
        "There was an error while trying to get the Terms and Conditions",
        ERR_CODES.MISSING_DATA,
        "No status ID found for `Approved` status",
      )
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
      throw new ExternalError(
        "There was an error while trying to get the Terms and Conditions",
        ERR_CODES.MISSING_DATA,
        `No rights-to-use asset found in domain ${domain.results[0].name} (ID: ${domain.results[0].id})`,
      )
    }

    const { body: attributes } = await HttpClient.get<Collibra.PagedAttributeResponse>(`${config.COLLIBRA_BASE_URL}/attributes`, {
      headers: { authorization },
      query: { assetId: rtuAssets!.results[0].id },
    })

    if (!attributes || attributes.total === 0) {
      throw new ExternalError(
        "There was an error while trying to get the Terms and Conditions",
        ERR_CODES.MISSING_DATA,
        `No attributes found for rights to use asset ${rtuAssets.results[0].name} (ID: ${rtuAssets.results[0].id})`,
      )
    }

    const terms = attributes.results.find((attr) => /terms and conditions/i.test(attr.type.name!))

    if (!terms) {
      throw new ExternalError(
        "There was an error while trying to get the Terms and Conditions",
        ERR_CODES.MISSING_DATA,
        `No terms and conditions found for rights to use asset ${rtuAssets.results[0].name} (ID: ${rtuAssets.results[0].id})`,
      )
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
          error: {
            code: error.code,
            message: error.message,
          },
        },
      }
    }

    return {
      props: defaultPageProps,
    }
  }
}

export default CheckoutTermsView
