import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useRouter } from "next/router"
import {
  FunctionComponent, useEffect, PropsWithChildren, useState,
} from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Stepper } from "./Stepper"
import type { CheckoutSteps } from "./types"

import { useCheckoutData } from "hooks/useCheckoutData"

const CheckoutNavContainer = styled.div`
  margin-block: ${tokens.spacings.comfortable.x_large} ${tokens.spacings.comfortable.xxx_large}  ;
`

const Heading = styled.div`
  min-height: 48px;
`

const ContentContainer = styled.div`
  width: 50%;
`
const steps: CheckoutSteps[] = ["terms", "access", "redirect"]

type Props = PropsWithChildren & {
  assetName?: string | null
}

export const CheckoutWizard: FunctionComponent<Props> = ({ assetName, children }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const intl = useIntl()
  const { removeItem } = useCheckoutData()

  useEffect(() => {
    const handleRouteChange = () => {
      const stepByPathName = steps.findIndex((step) => router.pathname.includes(step))
      // @TODO If a user manually refresh other steps than number 1, this logic
      // for current step will fail. See issue #83
      setCurrentStep(stepByPathName)
    }

    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
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
    <div>
      <Heading>
        <Typography variant="h1">
          <Typography variant="overline" as="div">{intl.formatMessage({ id: "checkout.title.eyebrow" })}</Typography>
          {assetName}
        </Typography>
      </Heading>
      <CheckoutNavContainer>
        <Stepper currentStep={currentStep} />
      </CheckoutNavContainer>
      <ContentContainer>
        {children}
      </ContentContainer>
    </div>
  )
}
