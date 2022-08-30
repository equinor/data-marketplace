/* eslint-disable camelcase */
import { Icon, Typography } from "@equinor/eds-core-react"
import { error_filled } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { FunctionComponent, PropsWithChildren } from "react"
import styled from "styled-components"

const errorColor = tokens.colors.interactive.danger__text.rgba

const ValidationContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${tokens.spacings.comfortable.small};
`

export const HelperTextStyles = styled(Typography)<{error?: boolean}>`
/* Stole styles form the helper text since variant="helper" has a runtime error */
font-size: 0.750rem;
line-height: 1.33em;
letter-spacing: 0.013em;
font-weight: 500;

${({ error }) => error && `
    color: ${errorColor};
  `}
`

export const ValidationError: FunctionComponent<PropsWithChildren> = ({ children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ValidationContainer {...rest}>
    <Icon data={error_filled} color={errorColor} size={16} />
    <HelperTextStyles error role="alert">{children}</HelperTextStyles>
  </ValidationContainer>
)
