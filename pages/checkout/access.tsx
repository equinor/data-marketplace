/* eslint-disable camelcase */
import { Button, TextField, Typography, Icon, Progress } from "@equinor/eds-core-react"
import { error_filled } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { ChangeEventHandler, useState } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { CancelButton, CheckoutWizard, NoAsset, formatCheckoutTitle } from "components/CheckoutWizard"
import { Page } from "components/Page"
import { config } from "config"
import { useCheckoutData } from "hooks/useCheckoutData"
import { HttpClient } from "lib/HttpClient"

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`
const FakeHelperText = styled(Typography)`
  color: ${tokens.colors.text.static_icons__tertiary.hex};
  margin: ${tokens.spacings.comfortable.small} 0 0 ${tokens.spacings.comfortable.small};
`

const ContinueButtonText = styled.span<{ invisible: boolean }>`
  visibility: ${({ invisible }) => (invisible ? "hidden" : "visible")};
`

const ButtonProgressContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const MIN_LENGTH = 10
const MAX_LENGTH = 250

const CheckoutAccessView: NextPage = () => {
  const intl = useIntl()
  const router = useRouter()
  const { checkoutData, setCheckoutData } = useCheckoutData()
  const [error, setError] = useState(false)
  const [collibraWorkflowError, setCollibraWorkflowError] = useState<Error>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

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

  const onContinueClick = async () => {
    if ((description && description.length < MIN_LENGTH) || description === undefined || description === "") {
      setError(true)
    } else {
      setError(false)
      try {
        setIsLoading(true)

        if (!config.PREVENT_COLLIBRA_WORKFLOW) {
          await HttpClient.post<Collibra.WorkflowInstance>("/api/workflows", {
            body: {
              assetId: checkoutData.asset?.id,
              termsAccepted: checkoutData.terms?.termsAccepted,
              description: checkoutData.access?.description,
            },
          })
        }
        router.push({
          pathname: "/checkout/redirect",
          query: { id: checkoutData.asset?.id },
        })
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.error("[CheckoutRedirectView] Failed to send checkout data to Collibra:", err)
        setCollibraWorkflowError(new Error(intl.formatMessage({ id: "checkout.redirect.collibraWorkflowError" })))
      }
    }
  }

  return (
    <Page
      documentTitle={formatCheckoutTitle(
        intl.formatMessage({ id: "checkout.prefix.title" }),
        intl.formatMessage({ id: "checkout.nav.step.access" })
      )}
    >
      <main>
        <CheckoutWizard assetName={checkoutData.asset?.name}>
          {!checkoutData.asset ? (
            <NoAsset />
          ) : (
            <>
              <TextField
                multiline
                id="description"
                label={intl.formatMessage({ id: "checkout.access.descriptionInput.label" }, { maxLength: MAX_LENGTH })}
                onChange={onDescriptionChange}
                value={description}
                rows={4}
                variant={error ? "error" : "default"}
                maxLength={MAX_LENGTH}
                meta={description ? `${description && description.length}` : "0"}
                helperText={
                  error
                    ? intl.formatMessage(
                      { id: "checkout.access.descriptionInput.errorMessage" },
                      { minLength: MIN_LENGTH }
                    )
                    : undefined
                }
                helperIcon={error && <Icon data={error_filled} />}
                aria-required
              />

              <FakeHelperText group="input" variant="helper">
                {intl.formatMessage({ id: "checkout.access.exampleBody" })}
              </FakeHelperText>

              <ButtonContainer>
                {collibraWorkflowError && (
                  <Typography variant="body_short" color={tokens.colors.interactive.danger__text.hex}>
                    {collibraWorkflowError.message}
                  </Typography>
                )}
                <CancelButton assetId={checkoutData.asset?.id} />
                <Button onClick={onContinueClick} disabled={isLoading}>
                  {isLoading && (
                    <ButtonProgressContainer>
                      <Progress.Circular variant="indeterminate" size={24} style={{ display: "block" }} />
                    </ButtonProgressContainer>
                  )}
                  <ContinueButtonText invisible={isLoading}>
                    {intl.formatMessage({ id: "common.continue" })}
                  </ContinueButtonText>
                </Button>
              </ButtonContainer>
            </>
          )}
        </CheckoutWizard>
      </main>
    </Page>
  )
}

export default CheckoutAccessView
