/* eslint-disable camelcase */
import { Icon } from "@equinor/eds-core-react"
import {
  exit_to_app,
  library_books,
  receipt,
  shopping_card,
} from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { VoidFunctionComponent } from "react"
import styled from "styled-components"

import { Link } from "../Link"

const NavItemsContainer = styled.ul`
  padding: 0;
  margin: 0;
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

export const CheckoutNav: VoidFunctionComponent = () => (
  <nav>
    <NavItemsContainer>
      <li>
        <NavLink href="/checkout/terms">
          <IconContainer>
            <Icon data={library_books} />
          </IconContainer>
          <NavLinkText>Terms of Use</NavLinkText>
        </NavLink>
      </li>
      <li>
        <NavLink href="/checkout/access" disabled aria-disabled="true">
          <IconContainer>
            <Icon data={shopping_card} />
          </IconContainer>
          <NavLinkText>Request access</NavLinkText>
        </NavLink>
      </li>
      <li>
        <NavLink href="/checkout/confirm" disabled aria-disabled="true">
          <IconContainer>
            <Icon data={receipt} />
          </IconContainer>
          <NavLinkText>Confirmation</NavLinkText>
        </NavLink>
      </li>
      <li>
        <NavLink href="/checkout/redirect" disabled aria-disabled="true">
          <IconContainer>
            <Icon data={exit_to_app} />
          </IconContainer>
          <NavLinkText>Redirect</NavLinkText>
        </NavLink>
      </li>
    </NavItemsContainer>
  </nav>
)
