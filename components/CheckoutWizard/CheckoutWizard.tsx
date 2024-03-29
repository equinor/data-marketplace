import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useRouter } from "next/router"
import { FunctionComponent, useEffect, PropsWithChildren, useState } from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { Container } from "../Container"
import { Heading } from "../Typography"

import { Stepper } from "./Stepper"
import type { CheckoutSteps } from "./types"

import { useCheckoutData } from "hooks/useCheckoutData"

const CheckoutNavContainer = styled.div`
  margin-block: ${tokens.spacings.comfortable.x_large} ${tokens.spacings.comfortable.xxx_large};
`

const Head = styled.div`
  min-height: 48px;
`
const Content = styled.div`
  @media screen and (min-width: 1000px) {
    max-width: 60%;
  }
`

const steps: CheckoutSteps[] = ["terms", "redirect"]

type Props = PropsWithChildren & {
  assetName?: string | null
  communityName?: string
}

export const CheckoutWizard: FunctionComponent<Props> = ({ assetName, communityName, children }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const { checkoutData, removeItem } = useCheckoutData()

  // @TODO This code doesn't work very well (both useEffect functions) The missing checkoutData in the dependency array
  // is actually a problem, since one can remove the locale storage using devtools on step 2 and
  // we will not notice that. But if we add it to the deps array, then if will fire if the user
  // clicks "Cancel" since we then remove the local storage and thus changes the checkoutData
  // We should revisit this.
  // Might be to overengineered with only 2 steps.

  useEffect(() => {
    const stepByPathname = steps.findIndex((step) => router.pathname.includes(step))
    if (stepByPathname > 0 && !(checkoutData as any)[steps[stepByPathname - 1]]) {
      // this will recursively redirect until the user ends up at either
      // a step after a step with data or until the first step
      router.push({
        pathname: `/checkout/${steps[stepByPathname - 1]}`,
        query: {
          id: router.query.id,
        },
      })
    }
    setCurrentStep(stepByPathname)
  }, [router])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      const isInTheCheckoutFlow = url.startsWith("/checkout")
      if (!isInTheCheckoutFlow) {
        removeItem()
      }
    }

    router.events.on("routeChangeStart", handleRouteChange)

    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [router.events, removeItem])

  return (
    <section>
      <Container highlight>
        {assetName && (
          <Head>
            <Heading level="h1" size="2xl">
              {communityName && (
                <Typography variant="overline" as="div">
                  {communityName}
                </Typography>
              )}
              {assetName}
            </Heading>
          </Head>
        )}
      </Container>
      <Container>
        <Content>
          <Heading level="h2" size="xl">
            <FormattedMessage id="checkout.form.title" />
          </Heading>
          <CheckoutNavContainer>
            <Stepper currentStep={currentStep} />
          </CheckoutNavContainer>
          {children}
        </Content>
      </Container>
    </section>
  )
}
