/* eslint-disable camelcase */
import {
  Button,
  Icon,
  Search,
  TopBar,
  Typography,
} from "@equinor/eds-core-react"
import { account_circle } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import NextLink from "next/link"
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

const UserNavbar = styled.nav`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  width: 60%;
  background-color: ${tokens.colors.ui.background__default.hex};
  display: flex;
  justify-content: flex-end;
`

const HeaderContentContainer = styled(Container)`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 5rem;
  }
`
const TopBarContainer = styled(TopBar)`
  width: 100%;
  margin-bottom: 2rem;

`
const LogoContainer = styled.div`
  width: fit-content;
  white-space: nowrap;
`

const ActionsContainer = styled(TopBar.Actions)`
  width: 100%;
  background-color: ${tokens.colors.ui.background__default.hex};
  display: flex;
  justify-content: flex-end;

`

const SearchContainer = styled(TopBar.CustomContent)`
  width: 80%;
  background-color: ${tokens.colors.ui.background__default.hex};
  display: flex;
  justify-content: flex-end;

`

const SearchForm = styled.form`
  width: 100%;
  align: right;
  margin-left: 5rem;
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
    <HeaderContentContainer>
      <TopBarContainer>
        <LogoContainer>
          <NextLink href="/" passHref>
            <Button as="a" variant="ghost" color="secondary">
              <Typography><FormattedMessage id="navbar.logo" /></Typography>
            </Button>
          </NextLink>
        </LogoContainer>
        <SearchContainer>
          <SearchForm onSubmit={onSearchSubmit}>
            <Search aria-label="sitewide" id="search-normal" placeholder={intl.formatMessage({ id: "navbar.placeholderSearch" })} onChange={onSearchChange} value={searchQuery} />
          </SearchForm>
        </SearchContainer>
        <ActionsContainer>
          <UserNavbar aria-label={intl.formatMessage({ id: "navbar.ariaUserMenu" })}>
            <Cart />
            <Button variant="ghost_icon" color="secondary">
              <Icon data={account_circle} title={intl.formatMessage({ id: "navbar.titleAccount" })} />
            </Button>
          </UserNavbar>
        </ActionsContainer>
      </TopBarContainer>
    </HeaderContentContainer>
  )
}
