/* eslint-disable camelcase */
import { Button, Icon, Menu } from "@equinor/eds-core-react"
import { account_circle, power } from "@equinor/eds-icons"
import { signOut } from "next-auth/react"
import { useEffect, useRef, useState } from "react"
import { useIntl } from "react-intl"
// @TODO Disable the log out option it there is no active session?

export const UserMenu = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Wait until after client-side hydration to show
  // as a workaround for the useEffectLayout in the EDS library
  useEffect(() => {
    setShowUserMenu(true)
  }, [])
  const intl = useIntl()

  const userMenuAnchor = useRef<HTMLButtonElement>(null)

  const onUserMenuAnchorClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
  }

  const onSignOutClick = () => signOut()

  if (!showUserMenu) {
    return null
  }

  return (
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
