import { JWT } from "next-auth/jwt"

import { HttpClient } from "./HttpClient"

import { config } from "config"

export type Token = JWT & {
  tokenType: string
  accessToken: string
  expiresAt: number
  refreshToken: string
  error?: string
}

type RefreshTokenResponse = {
  token_type: string
  scope: string
  expires_in: number
  ext_expires_in: number
  access_token: string
  refresh_token: string
  id_token: string
}

export const attemptAccessTokenRefresh = async (token: Token) => {
  const res = await HttpClient.post<RefreshTokenResponse>(
    `https://login.microsoftonline.com/${config.AUTH_TENANT_ID}/oauth2/v2.0/token`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.AUTH_CLIENT_ID,
        scope: `openid offline_access ${config.AUTH_SCOPE}`,
        redirect_uri: `${config.BASE_URL}/api/auth/callback/azure-ad`,
        grant_type: "refresh_token",
        client_secret: config.AUTH_CLIENT_SECRET,
        refresh_token: token.refreshToken,
      }),
    }
  )

  return {
    ...token,
    accessToken: res.body.access_token,
    expiresAt: Date.now() + res.body.expires_in * 1000,
    refreshToken: res.body.refresh_token ?? token.refreshToken, // Fall back to old refresh token
  }
}
