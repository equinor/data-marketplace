import { Button, Checkbox, Typography } from "@equinor/eds-core-react"
import type { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import { Banner } from "../../components/Banner"
import { CheckoutWizard } from "../../components/CheckoutWizard/CheckoutWizard"
import { NoAsset } from "../../components/CheckoutWizard/NoAsset"
import type { CheckoutViewProps } from "../../components/CheckoutWizard/types"
import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"
import { Dispatch, RootState } from "../../store"

const IngressContainer = styled.div`
  margin-bottom: 1.5rem;

  p:not(:last-child) {
    margin-bottom: 1rem;
  }
  
`

const ChecboxContainer = styled.div`
  margin-bottom: 1.5rem;

  label {
    position: relative;
    left: -12px;
  }

`

const TypographyHeader = styled(Typography)`
  font-weight: 500;
  font-size: 1.125rem;
  line-height: 1.5rem;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`

const CheckoutTermsView = ({ assetId }: CheckoutViewProps) => {
  const intl = useIntl()
  const dispatch = useDispatch<Dispatch>()
  const hasAcceptedTerms = useSelector(
    (state: RootState) => state.checkout.data.terms?.termsAccepted,
  )
  const router = useRouter()

  const onContinue = () => {
    router.push({
      pathname: "/checkout/access",
      query: { id: assetId },
    })
    dispatch.checkout.setStep(1)
  }

  const onAcceptTerms = () => {
    dispatch.checkout.setData({ terms: { termsAccepted: !hasAcceptedTerms } })
  }

  return (
    <>
      <Container>
        <CheckoutWizard>
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
                  <div>
                    <TypographyHeader>{intl.formatMessage({ id: "terms.banner.danger.heading1" })}</TypographyHeader>
                    <Typography>{intl.formatMessage({ id: "terms.banner.danger.description1" })}</Typography>
                    <TypographyHeader>{intl.formatMessage({ id: "terms.banner.danger.heading2" })}</TypographyHeader>
                    <Typography>{intl.formatMessage({ id: "terms.banner.danger.description2" })}</Typography>
                  </div>
                </Banner>
                <ChecboxContainer>
                  <Checkbox
                    name="acceptTerms"
                    label={intl.formatMessage({ id: "terms.acceptLabel" })}
                    onChange={onAcceptTerms}
                    checked={hasAcceptedTerms ?? false}
                    aria-invalid={hasAcceptedTerms ? "false" : "true"}
                    aria-required
                  />
                </ChecboxContainer>

                <ButtonContainer>
                  <Button variant="outlined" color="secondary">
                    {intl.formatMessage({ id: "common.cancel" })}
                  </Button>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  // @TODO when we have server side token handle the case of no id or no data
  return { props: { assetId: id || null } }
}

export default CheckoutTermsView
