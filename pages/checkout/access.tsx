import { Button, TextField, Typography } from "@equinor/eds-core-react"
import type { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ChangeEventHandler } from "react"
import { useIntl } from "react-intl"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import { CheckoutWizard, CheckoutViewProps, NoAsset } from "../../components/CheckoutWizard"
import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"
import { Dispatch, RootState } from "../../store"

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

const CheckoutAccessView = ({ assetId }: CheckoutViewProps) => {
  const intl = useIntl()
  const dispatch = useDispatch<Dispatch>()
  const description = useSelector((state: RootState) => state.checkout.data.access?.description) ?? ""
  const router = useRouter()

  const onDescriptionChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    dispatch.checkout.setData({
      access: {
        description: e.target.value,
      },
    })
  }

  const onContinueClick = () => {
    dispatch.checkout.setStep(2)
    router.push({
      pathname: "/checkout/confirm",
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
                    id="desciption"
                    label={intl.formatMessage({ id: "checkout.access.descriptionInput.label" })}
                    placeholder={intl.formatMessage({ id: "checkout.access.descriptionInput.placeholder" })}
                    onChange={onDescriptionChange}
                  />
                </TextFieldContainer>

                <ButtonContainer>
                  <Button
                    variant="outlined"
                    color="secondary"
                  >
                    {intl.formatMessage({ id: "common.cancel" })}
                  </Button>
                  <Button disabled={description.length < 10} onClick={onContinueClick}>
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

export default CheckoutAccessView
