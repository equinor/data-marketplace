import { Typography } from "@equinor/eds-core-react"
import { signIn, useSession } from "next-auth/react"
import type { FunctionComponent, PropsWithChildren } from "react"

import { Container } from "../Container"
import { Page } from "../Page"

export const AuthContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { status } = useSession()

  if (status === "loading") {
    return (
      <Container>
        <Typography>Signing you in&hellip;</Typography>
      </Container>
    )
  }

  if (status !== "authenticated") {
    signIn("azure-ad")

    return (
      <Container>
        <Typography>Please sign in</Typography>
      </Container>
    )
  }

  return (
    <Page>
      {children}
    </Page>
  )
}
