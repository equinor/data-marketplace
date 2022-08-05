/* eslint-disable camelcase */
import { Icon } from "@equinor/eds-core-react"
import { warning_filled } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { FunctionComponent, ReactNode } from "react"
import styled from "styled-components"

type Props = {
  variant: string
  children: ReactNode
}

const BannerContainer = styled.div<{ variant: string }>`
    background-color: ${({ variant }) => (variant === "danger" ? tokens.colors.ui.background__danger.rgba : tokens.colors.ui.background__warning.rgba)};
    display: flex;
    justify-content: start;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding: 1.5rem;
`

const BannerIcon = styled.div`
    line-height:0;
`
const TextWrapper = styled.div`
display: flex;
align-items: center;
`
export const Banner: FunctionComponent<Props> = ({ variant, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <BannerContainer variant={variant} {...rest}>
    <BannerIcon>
      <Icon color={variant === "danger" ? tokens.colors.interactive.danger__text.rgba : tokens.colors.interactive.warning__text.rgba} data={warning_filled} />
    </BannerIcon>
    <TextWrapper>
      {children}
    </TextWrapper>
  </BannerContainer>
)
