"use client"

/* eslint-disable camelcase */
import { Button, TopBar, Typography, Icon } from "@equinor/eds-core-react"
import { search } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import NextLink from "next/link"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { UserMenu } from "./UserMenu"

const TopbarWrapper = styled.div`
  box-shadow: ${tokens.elevation.none};
  border-bottom: 2px solid var(--background-light);
  background-color: var(--default);
  position: sticky;
  top: 0;
  z-index: 1;
`

const EDSTopBar = styled(TopBar)`
  padding-inline: calc(var(--layout-padding-inline) - var(--space-16));
  border-bottom: 0;
  box-shadow: none;
  max-width: var(--layout-max-width);
  margin-inline: auto;
`

export const NavBar = () => (
  <TopbarWrapper>
    <EDSTopBar>
      <TopBar.Header>
        <Button
          as={NextLink}
          href="/"
          variant="ghost"
          color="secondary"
          /* @ts-ignore */
          style={{ "--eds_interactive_secondary__highlight": "var(--baby-blue" }}
        >
          <Typography as="span">
            <FormattedMessage id="navbar.logo" />
          </Typography>
        </Button>
      </TopBar.Header>

      <TopBar.Actions>
        <Button
          variant="ghost_icon"
          as={NextLink}
          href="/search"
          aria-label="Search"
          color="secondary"
          /* @ts-ignore */
          style={{ "--eds_interactive_secondary__highlight": "var(--baby-blue" }}
        >
          <Icon data={search} />
        </Button>

        <UserMenu />
      </TopBar.Actions>
    </EDSTopBar>
  </TopbarWrapper>
)
