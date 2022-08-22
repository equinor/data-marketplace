import { useRouter } from "next/router"
import { FunctionComponent, useEffect, ReactNode } from "react"
import { useDispatch, useSelector } from "react-redux"
import styled from "styled-components"

import { Dispatch, RootState } from "../../store"

import { CheckoutNav } from "./Nav"

const CheckoutNavContainer = styled.div`
  margin-bottom: 1.5rem;
`

const ContentContainer = styled.div`
  width: 50%;
`
type Props = {
  children?: ReactNode,
  assetId: string | null
};

export const CheckoutWizard: FunctionComponent<Props> = ({ children, assetId }) => {
  const state = useSelector(({ checkout }: RootState) => checkout)
  const dispatch = useDispatch<Dispatch>()
  const router = useRouter()

  useEffect(() => {
    const localCheckoutData = JSON.parse(window.localStorage.getItem("checkout_data") ?? "{}")
    dispatch.checkout.setData(localCheckoutData)
  }, [dispatch])

  useEffect(() => {
    window.localStorage.setItem("checkout_data", JSON.stringify(state.data))
  }, [state.data])

  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      const steps = ["terms", "access", "confirm", "redirect"]
      const stepByPathName = steps.findIndex((step) => router.pathname.includes(step))
      dispatch.checkout.setStep(stepByPathName)
    })
  }, [router, dispatch])

  return (
    <div>
      <CheckoutNavContainer>
        <CheckoutNav assetId={assetId} currentStep={state.step} />
      </CheckoutNavContainer>

      <ContentContainer>
        {children}
      </ContentContainer>
    </div>
  )
}
