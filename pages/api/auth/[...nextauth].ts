import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import ADProvider from "next-auth/providers/azure-ad"
import qs from "query-string"

import { config } from "config"
import { HttpClient } from "lib/HttpClient"

const SCOPE = `openid offline_access ${config.AUTH_SCOPE}`

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
  console.log("[NextAuth] Attempting to refresh access token")

  try {
    const res = await HttpClient.post<RefreshTokenResponse>(`https://login.microsoftonline.com/${config.AUTH_TENANT_ID}/oauth2/v2.0/token`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: qs.stringify({
        client_id: config.AUTH_CLIENT_ID,
        scope: SCOPE,
        redirect_uri: `${config.BASE_URL}/api/auth/callback/azure-ad`,
        grant_type: "refresh_token",
        client_secret: config.AUTH_CLIENT_SECRET,
        refresh_token: token.refreshToken,
      }),
    })

    if (!res.body) {
      throw new Error(`No body in response from ${res.headers.origin}`)
    }

    return {
      ...token,
      accessToken: res.body.access_token,
      expiresAt: Date.now() + res.body.expires_in * 1000,
      refreshToken: res.body.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      error: undefined,
    }
  } catch (error) {
    console.error("[tryAccessTokenRefresh] Token refresh failed", error)

    // return old token with an error for the client
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

      if (Date.now() > (token as Token).expiresAt) {
        console.log(`[NextAuth] Access token expired at ${new Date()}`)
        return tryAccessTokenRefresh(token as Token)
      }

      return token
    },
  },
})
