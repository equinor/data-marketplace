/* eslint-disable camelcase */
import {
  Button,
  Icon,
  Menu,
  Search,
  TopBar,
  Typography,
} from "@equinor/eds-core-react"
import { account_circle, power } from "@equinor/eds-icons"
import { signOut } from "next-auth/react"
import NextLink from "next/link"
import { useRouter } from "next/router"
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

const EDSTopBar = styled(TopBar)`
  margin-bottom: 5rem;
`

const EDSCustomContent = styled(TopBar.CustomContent)`
  width: 100%;
`

export const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)

  const router = useRouter()
  const intl = useIntl()

  const userMenuAnchor = useRef<HTMLButtonElement>(null)

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

  const onUserMenuAnchorClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const onSignOutClick = () => signOut()

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
          <Button
            ref={userMenuAnchor}
            aria-controls="user-menu"
            aria-haspopup="true"
            id="user-menu-anchor"
            variant="ghost_icon"
            color="secondary"
            onClick={onUserMenuAnchorClick}
          >
            <Icon data={account_circle} title={intl.formatMessage({ id: "navbar.titleAccount" })} />
          </Button>

          <Menu
            anchorEl={userMenuAnchor.current}
            aria-labelledby="user-menu-anchor"
            id="user-menu"
            placement="bottom-end"
            open={isUserMenuOpen}
          >
            <Menu.Item onClick={onSignOutClick}>
              <Icon data={power} />
              Sign out
            </Menu.Item>
          </Menu>
        </nav>
      </TopBar.Actions>
    </EDSTopBar>
  )
}
