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
  // comment_discussion,
  explore,
  // refresh,
} from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Container } from "../Container"

import { Cart } from "./Cart"

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

const SearchForm = styled.form`
  width: 100%;
`

export const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const router = useRouter()
  const intl = useIntl()

  useEffect(() => {
    setSearchQuery(router.query.q as string ?? "")
  }, [router])

  const onSearchSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    router.push({
      pathname: "/search",
      query: {
        q: searchQuery,
      },
    })
    e.persist()
  }

  const onSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <>
      <UserNavbarContainer>
        <UserNavbar aria-label={intl.formatMessage({ id: "navbar.ariaUserMenu" })}>
          <Cart />
          {/* Hiding unused icons
          <Button href="/tasks" variant="ghost" color="secondary">
            <FormattedMessage id="navbar.taskStatistic" values={{ remaining: <span>0</span> }} />
          </Button>
          <Button variant="ghost_icon" color="secondary">
            <Icon data={refresh} title={intl.formatMessage({ id: "navbar.titleRefresh" })} />
          </Button>  */}
          <Button variant="ghost_icon" color="secondary">
            <Icon data={account_circle} title={intl.formatMessage({ id: "navbar.titleAccount" })} />
          </Button>
        </UserNavbar>
      </UserNavbarContainer>

      <Header>
        <HeaderContentContainer>
          <LogoContainer>
            <Link href="/">
              <Button as="a" variant="ghost" color="secondary">
                <Typography><FormattedMessage id="navbar.logo" /></Typography>
              </Button>
            </Link>
          </LogoContainer>

          <nav aria-label="Main navigation">
            <ActionsContainer>
              <Link href="/browse">
                <Button variant="ghost" color="secondary">
                  <Icon data={explore} title={intl.formatMessage({ id: "navbar.browse" })} />
                  <FormattedMessage id="navbar.browse" />
                </Button>
              </Link>
              {/*
              <Link href="/browse">
                <Button variant="ghost" color="secondary">
                  <Icon data={comment_discussion}
                   title={intl.formatMessage({ id: "navbar.community" })} />
                  <FormattedMessage id="navbar.community" />
                </Button>
              </Link>
              */}
            </ActionsContainer>
          </nav>

          <SearchForm onSubmit={onSearchSubmit}>
            <Search aria-label="sitewide" id="search-normal" placeholder={intl.formatMessage({ id: "navbar.placeholderSearch" })} onChange={onSearchChange} value={searchQuery} />
          </SearchForm>
        </HeaderContentContainer>
      </Header>
    </>
  )
}
