import { Typography } from "@equinor/eds-core-react"
import { useSession } from "next-auth/react"
import type { FunctionComponent, PropsWithChildren } from "react"
import { useIntl } from "react-intl"

import { SignIn } from "components/auth"

export const AuthContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { data, status } = useSession()
  const intl = useIntl()

  if (status === "loading") {
    return <Typography>{intl.formatMessage({ id: "auth.loading" })}</Typography>
  }

  if (status !== "authenticated" || data?.error === "RefreshAccessTokenError") {
    return <SignIn />
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
  )
}
