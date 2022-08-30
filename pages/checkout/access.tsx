/* eslint-disable camelcase */
import {
  Button, TextField, Typography, Icon,
} from "@equinor/eds-core-react"
import { error_filled } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { ChangeEventHandler, useState } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { CheckoutWizard, NoAsset, CancelButton } from "../../components/CheckoutWizard"
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
  color: ${tokens.colors.text.static_icons__tertiary.hex};
  margin: ${tokens.spacings.comfortable.small} 0 0  ${tokens.spacings.comfortable.small};
`

const MIN_LENGTH = 10
const MAX_LENGTH = 250

const CheckoutAccessView: NextPage = () => {
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
    if ((description && description.length < MIN_LENGTH) || description === undefined || description === "") {
      setError(true)
    } else {
      setError(false)
      router.push({
        pathname: "/checkout/redirect",
        query: { id: checkoutData.asset?.id },
      })
    }
  }

  return (
    <>
      <Container>
        <CheckoutWizard assetName={checkoutData.asset?.name}>
          {!checkoutData.asset ? (
            <NoAsset />
          ) : (
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
                meta={description ? `${description && description.length}` : "0"}
                helperText={error ? intl.formatMessage({ id: "checkout.access.descriptionInput.errorMessage" }, { minLength: MIN_LENGTH }) : ""}
                helperIcon={error && <Icon data={error_filled} />}
                aria-required
              />
              <FakeHelperText group="input" variant="helper">{intl.formatMessage({ id: "checkout.access.exampleBody" })}</FakeHelperText>
              <ButtonContainer>
                <CancelButton assetId={checkoutData.asset?.id} />
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

export default CheckoutAccessView
