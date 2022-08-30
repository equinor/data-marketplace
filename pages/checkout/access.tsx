/* eslint-disable camelcase */
import {
  Button, TextField, Typography, Icon,
} from "@equinor/eds-core-react"
import { error_filled } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { ChangeEventHandler, useState } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import {
  CheckoutWizard, AssetIdProp, NoAsset, CancelButton,
} from "../../components/CheckoutWizard"
import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"
import { useCheckoutData } from "../../hooks/useCheckoutData"

const Headline = styled(Typography).attrs(() => ({ variant: "h4" }))`
  margin-bottom: 0.25rem;
`

const Ingress = styled(Typography).attrs(() => ({ variant: "ingress" }))`
  margin-bottom: 2rem;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  > *:not(:last-child) {
    margin-right: 1rem;
  }
`
const FakeHelperText = styled(Typography)`
  /* Stole styles form the helper text since variant="helper" has a runtime error */
  font-size: 0.750rem;
  line-height: 1.33em;
  letter-spacing: 0.013em;
  margin: ${tokens.spacings.comfortable.small} 0 0  ${tokens.spacings.comfortable.small};
`

const MIN_LENGTH = 10
const MAX_LENGTH = 250

const CheckoutAccessView = ({ assetId }: AssetIdProp) => {
  const intl = useIntl()
  const router = useRouter()
  const { checkoutData, setCheckoutData } = useCheckoutData()
  const [error, setError] = useState(false)

  const description = checkoutData?.access?.description
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
    if (description && description.length < MIN_LENGTH) {
      setError(true)
    } else {
      setError(false)
      router.push({
        pathname: "/checkout/redirect",
        query: { id: assetId },
      })
    }
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
                <TextField
                  multiline
                  id="description"
                  label={intl.formatMessage({ id: "checkout.access.descriptionInput.label" }, { maxLength: MAX_LENGTH })}
                  placeholder={intl.formatMessage({ id: "checkout.access.descriptionInput.placeholder" })}
                  onChange={onDescriptionChange}
                  value={description}
                  rows={4}
                  variant={error ? "error" : "default"}
                  maxLength={MAX_LENGTH}
                  meta={`${description && description.length}`}
                  helperText={error ? intl.formatMessage({ id: "checkout.access.descriptionInput.errorMessage" }, { minLength: MIN_LENGTH }) : ""}
                  helperIcon={error && <Icon data={error_filled} title="Error" />}
                />
                <FakeHelperText>{intl.formatMessage({ id: "checkout.access.exampleBody" })}</FakeHelperText>
                <ButtonContainer>
                  <CancelButton assetId={assetId} />
                  <Button
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
  return { props: { assetId: id || null } }
}

export default CheckoutAccessView
