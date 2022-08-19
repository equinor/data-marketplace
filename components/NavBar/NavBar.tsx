/* eslint-disable camelcase */
import {
  Button,
  Icon,
  Search,
  TopBar,
  Typography,
} from "@equinor/eds-core-react"
import { account_circle } from "@equinor/eds-icons"
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

const EDSTopBar = styled(TopBar)`
  margin-bottom: 5rem;
`

const EDSCustomContent = styled(TopBar.CustomContent)`
  width: 50%;
  margin-left: 8rem;
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
    <EDSTopBar>
      <TopBar.Header>
        <NextLink href="/" passHref>
          <Button as="a" variant="ghost" color="secondary">
            <Typography><FormattedMessage id="navbar.logo" /></Typography>
          </Button>
        </NextLink>
      </TopBar.Header>
      <EDSCustomContent>
        <form onSubmit={onSearchSubmit}>
          <Search aria-label="sitewide" id="search-normal" placeholder={intl.formatMessage({ id: "navbar.placeholderSearch" })} onChange={onSearchChange} value={searchQuery} />
        </form>
      </EDSCustomContent>
      <TopBar.Actions>
        <nav aria-label={intl.formatMessage({ id: "navbar.ariaUserMenu" })}>
          <Button variant="ghost_icon" color="secondary">
            <Icon data={account_circle} title={intl.formatMessage({ id: "navbar.titleAccount" })} />
          </Button>
        </nav>
      </TopBar.Actions>

    </EDSTopBar>
  )
}
