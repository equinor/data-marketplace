/* eslint-disable camelcase */
import { Button, Icon, Menu } from "@equinor/eds-core-react"
import { account_circle, power } from "@equinor/eds-icons"
import { signOut } from "next-auth/react"
import { useRef, useState } from "react"
import { useIntl } from "react-intl"
// @TODO Disable the log out option it there is no active session?

export const UserMenu = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)

  const intl = useIntl()

  const userMenuAnchor = useRef<HTMLButtonElement>(null)

  const onUserMenuAnchorClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const onSignOutClick = () => signOut()

  return (
    <nav aria-label={intl.formatMessage({ id: "navbar.ariaUserMenu" })}>
      <Button
        ref={userMenuAnchor}
        aria-controls="user-menu"
        aria-haspopup="true"
        id="user-menu-anchor"
        variant="ghost_icon"
        color="secondary"
        /* @ts-ignore */
        style={{ "--eds_interactive_secondary__highlight": "var(--baby-blue" }}
        onClick={onUserMenuAnchorClick}
      >
        <Icon data={account_circle} />
      </Button>

      <Menu
        anchorEl={userMenuAnchor.current}
        aria-labelledby="user-menu-anchor"
        id="user-menu"
        placement="bottom-end"
        open={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
      >
        <Menu.Item onClick={onSignOutClick}>
          <Icon data={power} />
          Sign out
        </Menu.Item>
      </Menu>
    </nav>
  )
}
