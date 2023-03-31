import NextAuth from "next-auth"
import ADProvider from "next-auth/providers/azure-ad"

import { attemptAccessTokenRefresh, Token } from "../../../lib/attemptAccessTokenRefresh"

import { config } from "config"
import { getTokenExpirationTime } from "lib/getTokenExpirationTime"

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
  session: {
    maxAge: 60 * 60 * 24, // 24 hours
    generateSessionToken: () => crypto.randomUUID(),
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        return {
          accessToken: account.access_token,
          expiresAt: getTokenExpirationTime(account.access_token),
          refreshToken: account.refresh_token,
        }
      }

      if (Date.now() > (token.expiresAt as number)) {
        try {
          console.log("[NextAuth] Attempting to refersh access token")

          return attemptAccessTokenRefresh(token as Token)
        } catch (err) {
          console.log("[NextAuth] Failed refreshing access token", err)

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
        expires: new Date(token.expiresAt as number).toISOString(),
        token: token.accessToken,
        error: token.error,
      }
    },
  },
})
