/* eslint-disable camelcase */
import { Icon, List } from "@equinor/eds-core-react"
import {
  exit_to_app,
  library_books,
  receipt,
  shopping_card,
} from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import styled from "styled-components"

import { Link } from "../Link"

const { Item } = List

const NavItemsContainer = styled(List)`
  list-style: none;
  display: flex;
  justify-content: flex-start;

  > li:not(:last-child) {
    margin-right: 1rem;
  }
`

const NavLink = styled(Link)<{ disabled?: boolean }>`
  height: 3rem;
  padding-right: 1rem;
  display: flex;
  align-items: center;
  border-radius: 1.5rem;
  background-color: ${({ disabled }) => (disabled ? tokens.colors.interactive.disabled__fill.hex : tokens.colors.ui.background__info.hex)};
  color: ${({ disabled }) => (disabled ? tokens.colors.interactive.disabled__text.hex : "inherit")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  svg {
    fill: ${({ disabled }) => (disabled ? tokens.colors.interactive.disabled__text.hex : tokens.colors.infographic.substitute__blue_ocean.hex)};
  }
`

const IconContainer = styled.span`
  height: 3rem;
  width: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const NavLinkText = styled.span`
  padding-bottom: 1px;
  display: block;
`

type Props = {
  currentStep: number
}

export const CheckoutNav = ({ currentStep }: Props) => (
  <nav>
    <NavItemsContainer>
      <Item>
        <NavLink href="/checkout/terms">
          <IconContainer>
            <Icon data={library_books} />
          </IconContainer>
          <NavLinkText>Terms of Use</NavLinkText>
        </NavLink>
      </Item>
      <Item>
        <NavLink href="/checkout/access" disabled={currentStep < 1} aria-disabled={currentStep < 1}>
          <IconContainer>
            <Icon data={shopping_card} />
          </IconContainer>
          <NavLinkText>Request access</NavLinkText>
        </NavLink>
      </Item>
      <Item>
        <NavLink href="/checkout/confirm" disabled={currentStep < 2} aria-disabled={currentStep < 2}>
          <IconContainer>
            <Icon data={receipt} />
          </IconContainer>
          <NavLinkText>Confirmation</NavLinkText>
        </NavLink>
      </Item>
      <Item>
        <NavLink href="/checkout/redirect" disabled={currentStep < 3} aria-disabled={currentStep < 3}>
          <IconContainer>
            <Icon data={exit_to_app} />
          </IconContainer>
          <NavLinkText>Redirect</NavLinkText>
        </NavLink>
      </Item>
    </NavItemsContainer>
  </nav>
)
