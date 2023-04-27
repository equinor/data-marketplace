import { type Session as NextAuthSession } from "next-auth"

export type Session = NextAuthSession & {
  token: string
}

export async function getSession(cookie: string): Promise<Session | null> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  })

  const session: Session = await response.json()

  return Object.keys(session).length > 0 ? session : null
}
