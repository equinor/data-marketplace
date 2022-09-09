import { Typography } from "@equinor/eds-core-react"
import { signIn, useSession } from "next-auth/react"
import type { FunctionComponent, PropsWithChildren } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Container } from "../Container"

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  &:has(.background-highlight:last-child) {
    background-color: var(--highlight-colour);
  } 
`

export const AuthContainer: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const { data, status } = useSession()
  const intl = useIntl()

  if (status === "loading") {
    return (
      <Container>
        <Typography>{intl.formatMessage({ id: "auth.loading" })}</Typography>
      </Container>
    )
  }

  if (status !== "authenticated" || data?.error === "RefreshAccessTokenError") {
    signIn("azure-ad")

    return (
      <Container>
        <Typography>{intl.formatMessage({ id: "auth.prompt" })}</Typography>
      </Container>
    )
  }

  return (
    <PageWrapper>{children}</PageWrapper>
  )
}
