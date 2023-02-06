/* eslint-disable camelcase */
import { Button, Search, TopBar, Typography, Icon } from "@equinor/eds-core-react"
import { search } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { UserMenu } from "./UserMenu"

const TopbarWrapper = styled.div`
  box-shadow: ${tokens.elevation.none};
  border-bottom: 2px solid ${tokens.colors.ui.background__light.rgba};
  background-color: ${tokens.colors.ui.background__default.hex};
  position: sticky;
  top: 0;
  z-index: 1;
`

const EDSTopBar = styled(TopBar)`
  padding-inline: var(--layout-padding-inline);
  border-bottom: 0;
  box-shadow: none;
  max-width: var(--layout-max-width);
  margin-inline: auto;
`

const EDSCustomContent = styled(TopBar.CustomContent)`
  width: 100%;
`
type Props = {
  useImprovedSearch: boolean
}

export const NavBar = ({ useImprovedSearch }: Props) => {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const router = useRouter()
  const intl = useIntl()

  useEffect(() => {
    setSearchQuery((router.query.q as string) ?? "")
  }, [router])

  const onSearchSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()

    if (searchQuery !== "") {
      router.push({
        pathname: "/search",
        query: {
          q: searchQuery,
        },
      })
    }
    e.persist()
  }

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchQuery(e.target.value)
  }
  return (
    <TopbarWrapper>
      <EDSTopBar>
        <TopBar.Header>
          {/*  @ts-ignore  */}
          <Button as={NextLink} href="/" variant="ghost" color="secondary">
            <Typography as="span">
              <FormattedMessage id="navbar.logo" />
            </Typography>
          </Button>
        </TopBar.Header>
        {!useImprovedSearch && (
          <EDSCustomContent>
            <form onSubmit={onSearchSubmit}>
              <Search
                aria-label="sitewide"
                id="search-normal"
                placeholder={intl.formatMessage({ id: "navbar.placeholderSearch" })}
                onChange={onSearchChange}
                value={searchQuery}
              />
            </form>
          </EDSCustomContent>
        )}
        <TopBar.Actions>
          {useImprovedSearch && (
            /* @ts-ignore */
            <Button variant="ghost_icon" as={NextLink} href="/search-beta" aria-label="Search">
              <Icon data={search} />
            </Button>
          )}
          <UserMenu />
        </TopBar.Actions>
      </EDSTopBar>
    </TopbarWrapper>
  )
}
