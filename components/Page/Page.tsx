import Head from "next/head"
import { FunctionComponent, ReactNode } from "react"
import { useIntl } from "react-intl"

import { Footer } from "../Footer"
import { NavBar } from "../NavBar"

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

      {children}
      <Footer />
    </>
  )
}
