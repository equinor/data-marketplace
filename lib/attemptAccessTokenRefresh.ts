import { JWT } from "next-auth/jwt"

import { ERR_CODES } from "./errors"
import { AuthError } from "./errors/AuthError"
import { getTokenExpirationTime } from "./getTokenExpirationTime"

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
  try {
    const res = await fetch(`https://login.microsoftonline.com/${config.AUTH_TENANT_ID}/oauth2/v2.0/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: config.AUTH_CLIENT_ID as string,
        scope: `openid offline_access ${config.AUTH_SCOPE as string}`,
        redirect_uri: `${config.BASE_URL as string}/api/auth/callback/azure-ad`,
        grant_type: "refresh_token",
        client_secret: config.AUTH_CLIENT_SECRET as string,
        refresh_token: token.refreshToken,
      }),
    })

    const data: RefreshTokenResponse = await res.json()

    return {
      ...token,
      accessToken: data.access_token,
      expiresAt: getTokenExpirationTime(data.access_token),
      refreshToken: data.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (err) {
    /* eslint-disable no-console */
    console.error("[attemptAccessTokenRefresh] Failed to refresh access token", err)
    throw new AuthError("Failed to refresh access token", ERR_CODES.REFRESH_TOKEN_EXPIRED, { token })
  }
}
