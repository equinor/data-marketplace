/* eslint-disable camelcase */
import { List, Typography, Icon } from "@equinor/eds-core-react"
import { check_circle_outlined } from "@equinor/eds-icons"
import { FunctionComponent } from "react"
import styled from "styled-components"

const { Item } = List

const StyledStepperItem = styled(Item)`
  display: grid;
  grid-template-columns: min-content 1fr;
  --size1: calc(8 / 16 * 1rem);
`

const StepperIndex = styled.div<{ active?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 0.875rem;
  border: 1px solid;
  display: grid;
  place-content: center;
  color: ${({ active }) => (active ? "white" : "var(--light-grey)")};
  background-color: ${({ active }) => (active ? "var(--moss-green-100)" : "white")};
  border-color: ${({ active }) => (active ? "var(--moss-green-100)" : "var(--light-grey)")};
`

const StepperTitle = styled(Typography)<{ finished?: boolean }>`
  margin-left: var(--size1);
  background-image: ${({ finished }) =>
    finished
      ? "linear-gradient(white 50%, var(--moss-green-100) 0 calc(50% + 1px), white 0)"
      : "linear-gradient(white 50%, var(--medium-grey) 0 calc(50% + 1px), white 0)"};
  margin-right: var(--size1);
`
const Title = styled.span<{ active?: boolean; finished?: boolean }>`
  white-space: nowrap;
  background-color: white;
  padding-right: var(--size1);
  color: ${({ active, finished }) => (active || finished ? "var(--charcoal)" : "var(--light-grey)")};
  font-weight: ${({ active }) => (active ? "600" : "400")};
`

type Props = {
  label: string
  index: number
  currentStep: number
}

export const StepperItem: FunctionComponent<Props> = ({ label, index, currentStep }) => {
  const active = currentStep === index
  const finished = currentStep > index
  return (
    <StyledStepperItem>
      {finished ? (
        <Icon data={check_circle_outlined} color="var(--moss-green-100)" />
      ) : (
        <StepperIndex active={active}>{index + 1}</StepperIndex>
      )}
      <StepperTitle finished={finished}>
        <Title active={active} finished={finished}>
          {label}
        </Title>
      </StepperTitle>
    </StyledStepperItem>
  )
}
