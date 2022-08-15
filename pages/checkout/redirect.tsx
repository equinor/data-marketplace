import { Progress, Typography } from "@equinor/eds-core-react"
// import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next/types"
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { CheckoutWizard } from "../../components/CheckoutWizard/CheckoutWizard"
import { Container } from "../../components/Container"
import { config } from "../../config"

const Ingress = styled(Typography).attrs({ variant: "ingress" })`
  margin-bottom: 0.75rem;
`

const HelpText = styled(Typography)`
  margin-bottom: 1.5rem;
`

const CheckoutRedirectView: NextPage = () => {
  const [progress, setProgress] = useState<number>(0)
  const intl = useIntl()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p === 100) return 100
        return p + 2
      })
    }, 100)

    return () => clearInterval(interval)
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
    <Container>
      <CheckoutWizard>
        <Typography variant="h4" as="h1" style={{ marginBottom: "0.25rem" }}>{intl.formatMessage({ id: "checkout.redirect.headline" })}</Typography>

        <Ingress>{intl.formatMessage({ id: "checkout.redirect.ingress" })}</Ingress>

        <HelpText>
          <FormattedMessage
            id="checkout.redirect.body"
            values={{
              a: FormattedLink,
              link: config.ACCESSIT_BASE_URL,
            }}
          />
        </HelpText>

        <Progress.Linear
          variant="determinate"
          value={progress}
        />
      </CheckoutWizard>
    </Container>
  )
}

export default CheckoutRedirectView