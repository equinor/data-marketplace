"use client"

import { tokens } from "@equinor/eds-tokens"
import type { FunctionComponent, ReactNode } from "react"
import styled from "styled-components"

type BackgroundProps = {
  isHighlighted: boolean
}

const BackgroundContainer = styled.div.attrs<BackgroundProps>(({ isHighlighted }) =>
  isHighlighted
    ? {
        className: "background-highlight",
      }
    : {
        className: "background-default",
      }
)<BackgroundProps>`
  background-color: ${({ isHighlighted }) =>
    isHighlighted ? tokens.colors.infographic.primary__moss_green_13.hex : tokens.colors.ui.background__default.hex};
`

const StyledSection = styled.div`
  width: 100%;
  margin-inline: auto;
  max-width: var(--layout-max-width);
  margin-inline: auto;
  padding: var(--layout-padding-block) var(--layout-padding-inline);
  ${BackgroundContainer}.background-default + ${BackgroundContainer}.background-default &,
    ${BackgroundContainer}.background-highlight + ${BackgroundContainer}.background-highlight & {
    padding-top: 0;
  }
`

type Props = {
  highlight?: boolean
  children?: ReactNode | undefined
}

export const Container: FunctionComponent<Props> = ({ highlight = false, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <BackgroundContainer isHighlighted={highlight} {...rest}>
    <StyledSection>{children}</StyledSection>
  </BackgroundContainer>
)
