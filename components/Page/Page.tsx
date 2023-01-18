import { useSession } from "next-auth/react"
import Head from "next/head"
import Router from "next/router"
import { FunctionComponent, PropsWithChildren, useEffect } from "react"
import styled from "styled-components"

import { Footer } from "../Footer"
import { NavBar } from "../NavBar"

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &:has(.background-highlight:last-child) {
    background-color: var(--highlight-colour);
  }
`

type Props = PropsWithChildren<{
  documentTitle: string
}>

export const Page: FunctionComponent<Props> = ({ documentTitle, children }) => {
  const { data } = useSession()

  useEffect(() => {
    // @ts-ignore
    if (data?.error === "TokenRefreshFailure") {
      // See https://github.com/vercel/next.js/discussions/29403
      Router.push("/auth/signin")
    }
  }, [data])

  return (
    <PageWrapper>
      <Head>
        <title>{documentTitle}</title>
      </Head>
      <NavBar />

      {children}
      <Footer />
    </PageWrapper>
  )
}
