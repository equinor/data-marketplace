/* eslint-disable camelcase */
import { Button, Icon, Typography } from "@equinor/eds-core-react"
import { external_link } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next/types"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { CheckoutWizard, NoAsset, formatCheckoutTitle } from "components/CheckoutWizard"
import { Page } from "components/Page"
import { config } from "config"
import { useCheckoutData } from "hooks"

const StyledButton = styled(Button)`
  margin-top: ${tokens.spacings.comfortable.x_large};
`

const CheckoutRedirectView: NextPage = () => {
  const intl = useIntl()
  const { checkoutData } = useCheckoutData()

  return (
    <Page
      documentTitle={formatCheckoutTitle(
        intl.formatMessage({ id: "checkout.prefix.title" }),
        intl.formatMessage({ id: "checkout.nav.step.redirect" })
      )}
    >
      <main>
        <CheckoutWizard assetName={checkoutData.asset?.name}>
          {!checkoutData.asset ? (
            <NoAsset />
          ) : (
            <>
              <Typography variant="ingress">{intl.formatMessage({ id: "checkout.redirect.headline" })}</Typography>
              <StyledButton link href={config.ACCESSIT_BASE_URL} target="_blank" rel="noopener noreferrer nofollow">
                {intl.formatMessage({ id: "checkout.redirect.button.text" })}
                <Icon data={external_link} />
              </StyledButton>
            </>
          )}
        </CheckoutWizard>
      </main>
    </Page>
  )
}

export default CheckoutRedirectView
