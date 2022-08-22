import { Progress, Typography } from "@equinor/eds-core-react"
import type { GetServerSideProps } from "next/types"
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { CheckoutWizard, NoAsset, CheckoutViewProps } from "../../components/CheckoutWizard"
import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"
import { config } from "../../config"

const Ingress = styled(Typography).attrs({ variant: "ingress" })`
  margin-bottom: 0.75rem;
`

const HelpText = styled(Typography)`
  margin-bottom: 1.5rem;
`

const CheckoutRedirectView = ({ assetId }: CheckoutViewProps) => {
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
    <>
      <Container>
        <CheckoutWizard>
          {!assetId ? <NoAsset />
            : (
              <>
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

export default CheckoutRedirectView
