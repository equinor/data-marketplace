import Head from "next/head"
import { FunctionComponent, ReactNode } from "react"
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

type Props = {
  children: ReactNode
  documentTitle?: string
}

export const Page: FunctionComponent<Props> = ({ documentTitle, children }) => {
  const intl = useIntl()

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
