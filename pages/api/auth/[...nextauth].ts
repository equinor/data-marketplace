import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import ADProvider from "next-auth/providers/azure-ad"

import { config } from "../../../config"
import { HttpClient } from "../../../lib/HttpClient"

const SCOPE = "openid offline_access https://equinor-dev.collibra.com/user_impersonation"

type Token = JWT & {
  tokenType: string,
  accessToken: string,
  expiresAt: number,
  refreshToken: string,
  error?: string
}

type RefreshTokenResponse = {
  token_type: string
  scope: string
  expires_in: number,
  ext_expires_in: number,
  access_token: string,
  refresh_token: string,
  id_token: string
}

const tryAccessTokenRefresh = async (token: Token): Promise<Token> => {
  try {
    const res = await HttpClient.post<RefreshTokenResponse>("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: {
        client_id: config.AUTH_CLIENT_ID,
        scope: SCOPE,
        redirect_uri: "http://localhost:3000/api/auth/callback/azure-ad",
        grant_type: "refresh_token",
        client_secret: config.AUTH_CLIENT_SECRET,
        refresh_token: token.refreshToken,
      },
    })

    if (!res.body) {
      throw new Error(`No body in response from ${res.headers.origin}`)
    }

    console.log("[tryAccessTokenRefresh] Access token successfully refreshed")

    return {
      ...token,
      accessToken: res.body.access_token,
      expiresAt: Date.now() + res.body.expires_in * 1000,
      refreshToken: res.body.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.error("[tryAccessTokenRefresh] Token refresh failed", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

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
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        Object.assign(token, {
          tokenType: account.token_type,
          accessToken: account.access_token,
          // expires_at is a value representing in how many seconds the token expires.
          // we store it as a number representing how long since epoc it expires at.
          // that way we can do Date comparison to figure out when to refresh it.
          expiresAt: Date.now() + account.expires_at! * 1000,
          refreshToken: account.refresh_token,
        })
      }

      if (Date.now() > (token as Token).expiresAt) {
        return tryAccessTokenRefresh(token)
      }

      return token
    },
  },
})
