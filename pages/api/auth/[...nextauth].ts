import NextAuth from "next-auth"
import ADProvider from "next-auth/providers/azure-ad"

import { config } from "config"

const SCOPE = `openid offline_access ${config.AUTH_SCOPE}`

export default NextAuth({
  providers: [
    ADProvider({
      clientId: config.AUTH_CLIENT_ID,
      clientSecret: config.AUTH_CLIENT_SECRET,
      tenantId: config.AUTH_TENANT_ID,
      authorization: {
        params: {
          scope: SCOPE,
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("[NextAuth] User signed in. Retrieving access token")

        Object.assign(token, {
          tokenType: account.token_type,
          accessToken: account.access_token,
          /* expires_at is a value representing how many **seconds** since epoc
           * the token expires at. we store it as a number representing how many
           * **milliseconds** since epoc it expires at. that way we can do Date
           * comparison to figure out when to refresh it.
           *
           * we also subtract five minutes from it so that we're sure to refresh
           * the token **before** it expires.
           */
          expiresAt: account.expires_at! * 1000 - 60000 * 5,
          refreshToken: account.refresh_token,
        })
      }

      return token
    },
  },
})
