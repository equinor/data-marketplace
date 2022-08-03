import { InteractionStatus, InteractionType } from "@azure/msal-browser"
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useMsalAuthentication,
} from "@azure/msal-react"
import { Typography } from "@equinor/eds-core-react"
import {
  FunctionComponent, useEffect, useState, ReactNode,
} from "react"
import { FormattedMessage } from "react-intl"

import { config } from "../../config"
import { NavBar } from "../NavBar"

type Props = {
  children: ReactNode
};

export const Page: FunctionComponent<Props> = ({ children }) => {
  const { error: msalError } = useMsalAuthentication(InteractionType.Redirect, {
    redirectUri: `${config.BASE_URL}/auth/redirect`,
    scopes: ["openid", "https://equinor-dev.collibra.com/user_impersonation"],
  })
  const { instance, inProgress, accounts } = useMsal()
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (
      accounts.length > 0
      && inProgress === InteractionStatus.None
      && !msalError
    ) {
      setLoading(true);

      (async () => {
        try {
          const tokenResponse = await instance.acquireTokenSilent({
            account: accounts[0],
            scopes: ["openid", "https://equinor-dev.collibra.com/user_impersonation"],
          })

          localStorage.setItem("access_token", tokenResponse.accessToken)
          setLoading(false)
        } catch (error) {
          console.error("[Page] Failed to acquire access token. Attempting login redirect", error)
          await instance.acquireTokenRedirect({
            account: accounts[0],
            scopes: ["openid", "https://equinor-dev.collibra.com/user_impersonation"],
          })
        }
      })()
    }
  }, [instance, accounts, inProgress, msalError])

  return (
    <>
      <AuthenticatedTemplate>
        {loading ? (
          <Typography><FormattedMessage id="page.authenticatedLoading" /></Typography>
        ) : (
          <>
            <NavBar />
            {children}
          </>
        )}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Typography><FormattedMessage id="page.unauthenticated" /></Typography>
      </UnauthenticatedTemplate>
    </>
  )
}
