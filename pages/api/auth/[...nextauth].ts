import NextAuth from "next-auth"
import ADProvider from "next-auth/providers/azure-ad"

import { attemptAccessTokenRefresh, Token } from "../../../lib/attemptAccessTokenRefresh"

import { config } from "config"

const SCOPE = `openid offline_access ${config.AUTH_SCOPE}`

export default NextAuth({
  providers: [
    ADProvider({
      clientId: config.AUTH_CLIENT_ID as string,
      clientSecret: config.AUTH_CLIENT_SECRET as string,
      tenantId: config.AUTH_TENANT_ID as string,
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
        /* eslint-disable no-console */
        console.log("[NextAuth] User signed in. Retrieving access token")

        return {
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
        }
      }

      if (Date.now() > (token.expiresAt as number)) {
        try {
          return attemptAccessTokenRefresh(token as Token)
        } catch (err) {
          console.log("[NextAuth]", err)

          return {
            ...token,
            error: "TokenRefreshFailure",
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        token: token.accessToken,
        error: token.error,
      }
    },
  },
})
