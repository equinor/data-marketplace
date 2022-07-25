import { Button, Checkbox, Typography } from "@equinor/eds-core-react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useDispatch, useSelector } from "react-redux"

import { CheckoutWizard } from "../../components/CheckoutWizard/CheckoutWizard"
import { Container } from "../../components/Container"
import { Dispatch, RootState } from "../../store"

const CheckoutTermsView: NextPage = () => {
  const intl = useIntl()
  const dispatch = useDispatch<Dispatch>()
  const hasAcceptedTerms = useSelector(
    (state: RootState) => state.checkout.data.terms?.termsAccepted,
  )
  const router = useRouter()

  const onContinue = () => {
    router.push("/checkout/access")
    dispatch.checkout.setStep(1)
  }

  const onAcceptTerms = () => {
    dispatch.checkout.setData({ terms: { termsAccepted: !hasAcceptedTerms } })
  }

  return (
    <Container>
      <CheckoutWizard>
        <FormattedMessage
          id="terms.ingress"
          // eslint-disable-next-line react/no-unstable-nested-components
          values={{ p: (chunks) => <Typography>{chunks}</Typography> }}
        />

        {/* TODO: Add banner */}

        <Checkbox
          name="acceptTerms"
          label={intl.formatMessage({ id: "terms.acceptLabel" })}
          onChange={onAcceptTerms}
          checked={hasAcceptedTerms ?? false}
          aria-invalid={hasAcceptedTerms ? "false" : "true"}
          aria-required
        />

        <div>
          <Button variant="outlined" color="secondary">
            {intl.formatMessage({ id: "common.cancel" })}
          </Button>
          <Button
            disabled={!hasAcceptedTerms}
            onClick={onContinue}
          >
            {intl.formatMessage({ id: "common.continue" })}
          </Button>
        </div>
      </CheckoutWizard>
    </Container>
  )
}

export default CheckoutTermsView
