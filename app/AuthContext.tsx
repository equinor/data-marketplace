"use client"

import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

type AuthContextProps = {
  children: React.ReactNode
  // eslint-disable-next-line react/no-unused-prop-types
  session: Session
}

export const AuthContext = ({ children }: AuthContextProps) => <SessionProvider>{children}</SessionProvider>
