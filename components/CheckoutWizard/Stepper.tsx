import { List } from "@equinor/eds-core-react"
import { FunctionComponent } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { StepperItem } from "./StepperItem"

const StyledStepper = styled(List)`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr 1fr min-content;
  padding: 0;
`

type Props = {
  currentStep: number,
}

export const Stepper: FunctionComponent<Props> = ({ currentStep }) => {
  const intl = useIntl()
  return (
    <StyledStepper variant="numbered">
      <StepperItem label={intl.formatMessage({ id: "checkout.nav.step.terms" })} currentStep={currentStep} index={0} />
      <StepperItem label={intl.formatMessage({ id: "checkout.nav.step.access" })} currentStep={currentStep} index={1} />
      <StepperItem label={intl.formatMessage({ id: "checkout.nav.step.redirect" })} currentStep={currentStep} index={2} />
    </StyledStepper>
  )
}
