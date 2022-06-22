import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { FunctionComponent, ReactElement } from "react"
import { useIntl } from "react-intl"
import styled, { keyframes } from "styled-components"

const SpinnerContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: ${tokens.colors.ui.background__default.hex};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  } 100% {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  &,
  &::after {
    border-radius: 50%;
  }

  width: 5rem;
  height: 5rem;
  position: relative;
  border: 0.75rem solid ${tokens.colors.infographic.primary__moss_green_34.rgba};
  margin-bottom: 0.5rem;
  box-sizing: border-box;

  &::after {
    content: "";
    position: absolute;
    top: -0.75rem;
    left: -0.75rem;
    width: 100%;
    height: 100%;
    border: 0.75rem solid transparent;
    border-left-color: ${tokens.colors.infographic.primary__moss_green_100.hex};
    animation: 1s ${spin} linear infinite;
  }
`

type Props = {
  show: boolean
  label?: string
}

export const FullPageSpinner: FunctionComponent<Props> = ({ children, label, show }) => {
  const intl = useIntl()
  if (!show) return children as ReactElement

  return (
    <SpinnerContainer>
      <Spinner />
      <Typography variant="body_short_bold">{label ?? intl.formatMessage({ id: "spinner.loading" })}</Typography>
    </SpinnerContainer>
  )
}
