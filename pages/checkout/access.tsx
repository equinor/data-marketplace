import { Button, TextField, Typography } from "@equinor/eds-core-react"
import type { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ChangeEventHandler } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { CheckoutWizard, AssetIdProp, NoAsset } from "../../components/CheckoutWizard"
import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"
import { useCheckoutData } from "../../hooks/useCheckoutData"

const Headline = styled(Typography).attrs(() => ({ variant: "h4" }))`
  margin-bottom: 0.25rem;
`

const Ingress = styled(Typography).attrs(() => ({ variant: "ingress" }))`
  margin-bottom: 2rem;
`

const ExampleContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;

  p:first-child {
    margin-right: 1rem;
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`

const TextFieldContainer = styled.div`
  margin-bottom: 1.5rem;
`

const CheckoutAccessView = ({ assetId }: AssetIdProp) => {
  const intl = useIntl()
  const router = useRouter()
  const { checkoutData, setCheckoutData } = useCheckoutData()

  const description = checkoutData?.access?.description || ""
  const onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setCheckoutData({
      ...checkoutData,
      access: {
        ...checkoutData.access,
        description: e.target.value,
      },
    })
  }

  const onContinueClick = () => {
    router.push({
      pathname: "/checkout/redirect",
      query: { id: assetId },
    })
  }

  return (
    <>
      <Container>
        <CheckoutWizard assetId={assetId}>
          {!assetId ? <NoAsset />
            : (
              <>
                <Headline>
                  {intl.formatMessage({ id: "checkout.access.headline" })}
                </Headline>
                <Ingress>
                  {intl.formatMessage({ id: "checkout.access.ingress" })}
                </Ingress>

                <ExampleContainer>
                  <Typography variant="caption">
                    {intl.formatMessage({ id: "checkout.access.exampleLabel" })}
                  </Typography>
                  <Typography variant="caption">
                    {intl.formatMessage({ id: "checkout.access.exampleBody" })}
                  </Typography>
                </ExampleContainer>

                <TextFieldContainer>
                  <TextField
                    multiline
                    id="description"
                    label={intl.formatMessage({ id: "checkout.access.descriptionInput.label" })}
                    placeholder={intl.formatMessage({ id: "checkout.access.descriptionInput.placeholder" })}
                    onChange={onDescriptionChange}
                    value={checkoutData?.access?.description}
                  />
                </TextFieldContainer>

                <ButtonContainer>
                  <Button
                    variant="outlined"
                    color="secondary"
                  >
                    {intl.formatMessage({ id: "common.cancel" })}
                  </Button>
                  <Button
                    disabled={description.length < 10}
                    onClick={onContinueClick}
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
  return { props: { assetId: id || undefined } }
}

export default CheckoutAccessView
