import Head from "next/head"
import { FunctionComponent } from "react"

import { NavBar } from "../NavBar"

type Props = {
  title?: string
}

export const Page: FunctionComponent<Props> = ({ children, title }) => (
  <>
    <Head>
      <title>
        {title ? `${title} \u2013 ` : ""}
        Equinor Data Marketplace
      </title>
    </Head>

    <NavBar />

    {children}
  </>
)
