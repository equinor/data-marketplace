/* eslint-disable camelcase */
import {
  Button,
  Icon,
  Search,
  TopBar,
  Typography,
} from "@equinor/eds-core-react"
import {
  account_circle,
  comment_discussion,
  explore,
  refresh,
  shopping_card,
} from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import Link from "next/link"
import { VoidFunctionComponent } from "react"
import styled from "styled-components"

import { Container } from "../Container"

const UserNavbarContainer = styled(Container)`
  width: 100%;
  background-color: ${tokens.colors.ui.background__default.hex};
  display: flex;
  justify-content: flex-end;
`

const UserNavbar = styled.nav`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`

const Header = styled.header`
  background-color: ${tokens.colors.ui.background__default.hex};
  width: 100%;
  padding: 0.5rem 0;
  position: sticky;
  top: 0;
  border-bottom: 2px solid ${tokens.colors.ui.background__light.hex};
  margin-bottom: 5rem;
`

const HeaderContentContainer = styled(Container)`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 5rem;
  }
`

const LogoContainer = styled.div`
  width: fit-content;
  white-space: nowrap;
`

const ActionsContainer = styled(TopBar.Actions)`
  display: flex;

  > *:not(:last-child) {
    margin-right: 0.5rem;
  }
`

export const NavBar: VoidFunctionComponent = () => (
  <>
    <UserNavbarContainer>
      <UserNavbar aria-label="User menu">
        <Button href="/cart" variant="ghost_icon" color="secondary">
          <Icon data={shopping_card} title="shopping cart" />
        </Button>
        <Button href="/tasks" variant="ghost" color="secondary">
          Tasks
          {" "}
          <span>0</span>
        </Button>
        <Button variant="ghost_icon" color="secondary">
          <Icon data={refresh} title="refresh" />
        </Button>
        <Button variant="ghost_icon" color="secondary">
          <Icon data={account_circle} title="account" />
        </Button>
      </UserNavbar>
    </UserNavbarContainer>

    <Header>
      <HeaderContentContainer>
        <LogoContainer>
          <Typography>Equinor Data Marketplace</Typography>
        </LogoContainer>

        <nav aria-label="Main navigation">
          <ActionsContainer>
            <Link href="/browse" passHref>
              <Button variant="ghost" color="secondary">
                <Icon data={explore} title="browse" />
                Browse
              </Button>
            </Link>
            <Link href="/browse" passHref>
              <Button variant="ghost" color="secondary">
                <Icon data={comment_discussion} title="community" />
                Community
              </Button>
            </Link>
          </ActionsContainer>
        </nav>

        <Search aria-label="sitewide" id="search-normal" placeholder="Search" />
      </HeaderContentContainer>
    </Header>
  </>
)
