import { tokens } from "@equinor/eds-tokens"
import type { FunctionComponent, PropsWithChildren } from "react"
import styled from "styled-components"

const StyledValidationError = styled.span`
  display: block;
  color: ${tokens.colors.interactive.danger__resting.hex}
`

export const ValidationError: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <StyledValidationError role="alert">{children}</StyledValidationError>
)
