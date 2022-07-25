import { Typography } from "@equinor/eds-core-react"
import { NextPage } from "next"
import React from "react"
import { FormattedMessage } from "react-intl"

import { CheckoutWizard } from "../../components/CheckoutWizard/CheckoutWizard"
import { Container } from "../../components/Container"

const CheckoutTermsView: NextPage = () => (
  <Container>
    <CheckoutWizard>
      <FormattedMessage
        id="terms.ingress"
          // eslint-disable-next-line react/no-unstable-nested-components
        values={{ p: (chunks) => <Typography>{chunks}</Typography> }}
      />
    </CheckoutWizard>
  </Container>
)

export default CheckoutTermsView
