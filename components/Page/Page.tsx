import { useSession } from "next-auth/react"
import Head from "next/head"
import { useRouter } from "next/router"
import { FunctionComponent, PropsWithChildren, useEffect } from "react"
import { useIntl } from "react-intl"
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
  documentTitle?: string
}>

export const Page: FunctionComponent<Props> = ({ documentTitle, children }) => {
  const intl = useIntl()
  const { data } = useSession()
  const router = useRouter()

  useEffect(() => {
    // @ts-ignore
    if (data?.error === "TokenRefreshFailure") {
      router.push("/auth/signin")
    }
  }, [data])

  return (
    <PageWrapper>
      <Head>
        <title>{documentTitle || intl.formatMessage({ id: "common.documentTitle" })}</title>
      </Head>
      <NavBar />

      {children}
      <Footer />
    </PageWrapper>
  )
}
