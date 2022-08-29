import { CircularProgress, Typography } from "@equinor/eds-core-react"
import { useRouter } from "next/router"
import {
  FunctionComponent, useEffect, PropsWithChildren, useState,
} from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { useAssetData } from "../../hooks/useAssetData"
import { useCheckoutData } from "../../hooks/useCheckoutData"

import { Stepper } from "./Stepper"
import type { AssetIdProp, CheckoutSteps } from "./types"

const CheckoutNavContainer = styled.div`
  margin: 1.5rem 0;
`

const Heading = styled.div`
  min-height: 48px;
`

const ContentContainer = styled.div`
  width: 50%;
`
const steps: CheckoutSteps[] = ["terms", "access", "redirect"]

type Props = PropsWithChildren & AssetIdProp;

export const CheckoutWizard: FunctionComponent<Props> = ({ children, assetId }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const router = useRouter()
  const intl = useIntl()
  const { assetData, isLoading } = useAssetData(assetId)
  const { removeItem } = useCheckoutData()

  // @TODO We might or might not need this initial value later on
  // const localCheckoutData = JSON.parse(window.localStorage.getItem("checkout_data") ?? "{}")

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
      const isInTheCheckoutFlow = steps.find((step) => url.includes(step))
      if (isInTheCheckoutFlow === undefined) {
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

        {isLoading ? <CircularProgress /> : (
          <Typography variant="h1">
            <Typography variant="overline" as="div">{intl.formatMessage({ id: "checkout.title.eyebrow" })}</Typography>
            {assetData?.name}
          </Typography>
        )}
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
