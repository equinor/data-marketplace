/* eslint-disable camelcase */
import { Icon, Typography } from "@equinor/eds-core-react"
import { error_filled } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { FunctionComponent, PropsWithChildren } from "react"
import styled from "styled-components"

const errorColor = "var(--validation-error)"

const ValidationContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${tokens.spacings.comfortable.small};
`

const HelperTextStyles = styled(Typography)`
  color: ${errorColor};
`

export const ValidationError: FunctionComponent<PropsWithChildren> = ({ children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ValidationContainer {...rest}>
    <Icon data={error_filled} color={errorColor} size={16} />
    <HelperTextStyles group="input" variant="helper" role="alert">
      {children}
    </HelperTextStyles>
  </ValidationContainer>
)
