import { InteractionStatus, InteractionType } from "@azure/msal-browser"
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useMsalAuthentication,
} from "@azure/msal-react"
import { Typography } from "@equinor/eds-core-react"
import { FunctionComponent, useEffect, useState } from "react"

import { config } from "../../config"
import { NavBar } from "../NavBar"

export const Page: FunctionComponent = ({ children }) => {
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
      && !localStorage.getItem("access_token")
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
          console.error("[Page] failed to acquire client access token", error)
        }
      })()
    }
  }, [instance, accounts, inProgress, msalError])

  return (
    <>
      <AuthenticatedTemplate>
        {loading ? (
          <Typography>Signing you in</Typography>
        ) : (
          <>
            <NavBar />
            {children}
          </>
        )}
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <Typography>Please sign in</Typography>
      </UnauthenticatedTemplate>
    </>
  )
}
