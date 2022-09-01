import { Progress, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next/types"
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { CheckoutWizard, NoAsset } from "components/CheckoutWizard"
import { Container } from "components/Container"
import { Footer } from "components/Footer"
import { config } from "config"
import { useCheckoutData } from "hooks"

const HelpText = styled(Typography)`
  margin-bottom: 1.5rem;
`

const Redirect = styled.div`
  margin-block: ${tokens.spacings.comfortable.xx_large}
`

const CheckoutRedirectView: NextPage = () => {
  const [progress, setProgress] = useState<number>(0)
  const intl = useIntl()
  const { checkoutData } = useCheckoutData()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p === 100) return 100
        return p + 2
      })
    }, 100)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (progress === 100) {
      window.open(config.ACCESSIT_BASE_URL, "_blank")
    }
  }, [progress])

  const FormattedLink = useCallback((chunks: ReactNode[]) => (
    <Typography
      link
      href={config.ACCESSIT_BASE_URL}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {chunks}
    </Typography>
  ), [])

  return (
    <>
      <Container>
        <CheckoutWizard assetName={checkoutData.asset?.name}>
          {!checkoutData.asset ? (
            <NoAsset />
          ) : (
            <>
              <Typography variant="ingress">
                {intl.formatMessage({ id: "checkout.redirect.headline" })}
              </Typography>
              <Redirect>
                <Typography variant="caption">{intl.formatMessage({ id: "checkout.redirect.label" })}</Typography>
                <Progress.Linear
                  variant="determinate"
                  value={progress}
                />
              </Redirect>
            </>
          )}
          <HelpText>
            <FormattedMessage
              id="checkout.redirect.body"
              values={{
                a: FormattedLink,
                link: config.ACCESSIT_BASE_URL,
              }}
            />
          </HelpText>
        </CheckoutWizard>
      </Container>
      <Footer />
    </>
  )
}

export default CheckoutRedirectView
