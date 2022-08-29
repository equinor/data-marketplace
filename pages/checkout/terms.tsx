import { Button, Checkbox, Typography } from "@equinor/eds-core-react"
import type { GetServerSideProps, NextPage } from "next"
import { getToken } from "next-auth/jwt"
import { useRouter } from "next/router"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"
import xss from "xss"

import { Banner } from "../../components/Banner"
import { CheckoutWizard, NoAsset, CancelButton } from "../../components/CheckoutWizard"
import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"
import { config } from "../../config"
import { useCheckoutData } from "../../hooks/useCheckoutData"
import { HttpClient } from "../../lib/HttpClient"

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

type Props = {
  assetId: string
  rightsToUse?: {
    name: string
    value: string
  }
}

const CheckoutTermsView: NextPage<Props> = ({ assetId, rightsToUse }) => {
  const intl = useIntl()
  const router = useRouter()

  const { checkoutData, setCheckoutData } = useCheckoutData()

  const hasAcceptedTerms = checkoutData?.terms?.termsAccepted
  const onContinue = () => {
    router.push({
      pathname: "/checkout/access",
      query: { id: assetId },
    })
  }

  const onAcceptTerms = () => {
    setCheckoutData({
      ...checkoutData,
      assetId,
      terms: { ...checkoutData.terms, termsAccepted: !hasAcceptedTerms },
    })
  }

  return (
    <>
      <Container>
        <CheckoutWizard assetId={assetId}>
          {!assetId ? <NoAsset />
            : (
              <>
                <IngressContainer>
                  <FormattedMessage
                    id="terms.ingress"
                    // eslint-disable-next-line react/no-unstable-nested-components
                    values={{ p: (chunks) => <Typography>{chunks}</Typography> }}
                  />
                </IngressContainer>
                <Banner variant="danger">
                  <Typography variant="h5" as="h2">{rightsToUse?.name}</Typography>
                  <Typography dangerouslySetInnerHTML={{ __html: rightsToUse?.value! }} />
                </Banner>
                <CheckboxContainer>
                  <Checkbox
                    name="acceptTerms"
                    label={intl.formatMessage({ id: "terms.acceptLabel" })}
                    onChange={onAcceptTerms}
                    checked={hasAcceptedTerms ?? false}
                    aria-invalid={hasAcceptedTerms ? "false" : "true"}
                    aria-required
                  />
                </CheckboxContainer>
                <ButtonContainer>
                  <CancelButton assetId={assetId} />
                  <Button
                    disabled={!hasAcceptedTerms}
                    onClick={onContinue}
                  >
                    {intl.formatMessage({ id: "common.continue" })}
                  </Button>
                </ButtonContainer>
              </>
            )}
        </CheckoutWizard>
      </Container>
      <Footer />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id } = query
  // @TODO when we have server side token handle the case of no id or no data
  // We should query for terms and the asset title and evaluate how much this will
  // affect TTFB

  const defaultPageProps: Props = { assetId: id as string }

  const token = await getToken({ req })

  const authorization = `Bearer ${token!.accessToken}`

  try {
    const { body: dataProduct } = await HttpClient.get<Collibra.Asset>(`${config.COLLIBRA_BASE_URL}/assets/${id}`, {
      headers: { authorization },
    })

    if (!dataProduct || !dataProduct.domain.name) {
      console.warn("[CheckoutTermsView] No data product or domain name found for", id)
      return { props: defaultPageProps }
    }

    const { body: domain } = await HttpClient.get<Collibra.PagedResponse>(`${config.COLLIBRA_BASE_URL}/domains`, {
      headers: { authorization },
      query: {
        name: `${dataProduct.domain.name.split(" ")[0]} - rights-to-use`,
        nameMatchMode: "ANYWHERE",
      },
    })

    if (!domain || domain.total === 0) {
      console.warn("[ChekcoutTermsView] No rights-to-use domain found for", dataProduct.domain.name)
      return { props: defaultPageProps }
    }

    const { body: statuses } = await HttpClient.get<Collibra.PagedResponse>(`${config.COLLIBRA_BASE_URL}/statuses`, {
      headers: { authorization },
      query: {
        name: "approved",
        nameMatchMode: "ANYWHERE",
      },
    })

    if (!statuses || statuses.total === 0) {
      console.warn("[CheckoutTermsView] No status ID found for `Approved` status")
      return { props: defaultPageProps }
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
      console.log("[CheckoutTermsView] No rights-to-use asset found in domain", domain.results[0].name, `(ID: ${domain.results[0].id})`)
      return { props: defaultPageProps }
    }

    const { body: attributes } = await HttpClient.get<Collibra.PagedAttributeResponse>(`${config.COLLIBRA_BASE_URL}/attributes`, {
      headers: { authorization },
      query: { assetId: rtuAssets!.results[0].id },
    })

    if (!attributes || attributes.total === 0) {
      console.log("[CheckoutTermsView] No attributes found for rights to use asset", rtuAssets.results[0].name, `(ID: ${rtuAssets.results[0].id})`)
      return { props: defaultPageProps }
    }

    const terms = attributes.results.find((attr) => /terms and conditions/i.test(attr.type.name!))

    if (!terms) {
      console.log("[CheckoutTermsView] No terms and conditions found for rights to use asset", rtuAssets.results[0].name, `(ID: ${rtuAssets.results[0].id})`)
      return { props: defaultPageProps }
    }

    return {
      props: {
        ...defaultPageProps,
        rightsToUse: {
          name: terms.asset.name,
          value: xss(terms.value),
        },
      },
    }
  } catch (error) {
    console.error(`[CheckoutTermsView] in getServersideProps - Failed getting rights-to-use for asset ${id}`, error)

    return { props: defaultPageProps }
  }
}

export default CheckoutTermsView
