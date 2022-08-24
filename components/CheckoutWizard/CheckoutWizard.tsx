import { CircularProgress, Typography } from "@equinor/eds-core-react"
import { useRouter } from "next/router"
import {
  FunctionComponent, useEffect, PropsWithChildren, useState,
} from "react"
import { useIntl } from "react-intl"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import { useAssetData } from "../../hooks/useAssetData"
import { Dispatch, RootState } from "../../store"

/* import { CheckoutNav } from "./Nav" */
import { Stepper } from "./Stepper"
import type { AssetIdProp } from "./types"

const CheckoutNavContainer = styled.div`
  margin: 1.5rem 0;
`

const Heading = styled.div`
  min-height: 48px;
`

const ContentContainer = styled.div`
  width: 50%;
`

type Props = PropsWithChildren & AssetIdProp;

export const CheckoutWizard: FunctionComponent<Props> = ({ children, assetId }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const state = useSelector(({ checkout }: RootState) => checkout)
  const dispatch = useDispatch<Dispatch>()
  const router = useRouter()
  const intl = useIntl()
  const { assetData, isLoading } = useAssetData(assetId)
  useEffect(() => {
    const localCheckoutData = JSON.parse(window.localStorage.getItem("checkout_data") ?? "{}")
    dispatch.checkout.setData(localCheckoutData)
  }, [dispatch])

  useEffect(() => {
    window.localStorage.setItem("checkout_data", JSON.stringify(state.data))
  }, [state.data])

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      const steps = ["terms", "access", "redirect"]
      const stepByPathName = steps.findIndex((step) => router.pathname.includes(step))
      // @TODO If a user manually refresh other steps than number 1, this logic
      // for current step will fail. See issue #83
      setCurrentStep(stepByPathName)
    })
  }, [router])

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
      {/* <CheckoutNavContainer>
        <CheckoutNav assetId={assetId} currentStep={state.step} />
      </CheckoutNavContainer> */}
      <CheckoutNavContainer>
        <Stepper currentStep={currentStep} />
      </CheckoutNavContainer>
      <ContentContainer>
        {children}
      </ContentContainer>
    </div>
  )
}
