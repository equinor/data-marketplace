import { tokens } from "@equinor/eds-tokens"
import Head from "next/head"
import { FunctionComponent, ReactNode } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Footer } from "../Footer"
import { NavBar } from "../NavBar"

// @TODO: What do we actually want to do with this space
const Spacer = styled.span`
  background-color: ${tokens.colors.ui.background__default.hex};
  display: block;
  height: 5rem;
`

type Props = {
  children: ReactNode
};

export const Page: FunctionComponent<Props> = ({ children }) => {
  const intl = useIntl()

  return (
    <>
      <Head>
        <title>
          {intl.formatMessage({ id: "common.documentTitle" })}
        </title>
      </Head>
      <NavBar />
      <Spacer />
      {children}
      <Footer />
    </>
  )
}
