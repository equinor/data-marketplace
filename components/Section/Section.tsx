import { tokens } from "@equinor/eds-tokens"
import type { FunctionComponent, ReactNode } from "react"
import styled from "styled-components"

const StyledSection = styled.section`
    width: 100%;
    max-width: var(--layout-max-width);
    margin-inline: auto;
    padding-bottom: 2rem;
    padding-inline: var(--layout-padding-inline);
    @media screen and (min-width: 768px) {
      padding-bottom: 2.5rem;
    }

    @media screen and (min-width: 992px) {
      padding-bottom: 3.5rem;
    }

    @media screen and (min-width: 1200px) {
      padding-bottom: 5rem;
    }
`

type BackgroundProps = {
  isHighlighted: boolean
}

const BackgroundContainer = styled.div.attrs<BackgroundProps>(({ isHighlighted }) => (isHighlighted
 && {
   className: "background-highlight",
 }

))<BackgroundProps>`
  background-color: ${({ isHighlighted }) => (isHighlighted ? "var(--highlight-colour)" : tokens.colors.ui.background__default.hex)} ;
`

type Props = {
  highlight?: boolean,
  children?: ReactNode | undefined;
}

export const Section: FunctionComponent<Props> = ({ highlight = false, children }) => (
  <BackgroundContainer isHighlighted={highlight}>
    <StyledSection>
      {children}
    </StyledSection>
  </BackgroundContainer>
)
