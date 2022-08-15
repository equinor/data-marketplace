import { FunctionComponent, ReactNode } from "react"

import { NavBar } from "../NavBar"

type Props = {
  children: ReactNode
};

export const Page: FunctionComponent<Props> = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
)
