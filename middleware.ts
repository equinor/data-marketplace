import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

import { attemptAccessTokenRefresh, type Token } from "lib/attemptAccessTokenRefresh"

export default withAuth(async (req) => {
  // console.log("[Middleware]", req.nextauth)
  const { token } = req.nextauth

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  if (Date.now() > (token?.expiresAt as number)) {
    console.log("[Middleware] Access token expried")

    try {
      console.log("[Middleware] Attempting to refresh access token")

      const newToken = await attemptAccessTokenRefresh(token as Token)
      Object.assign(req.nextauth, { token: newToken })

      console.log("[Middleware] Successfully refreshed access token")

      return NextResponse.next()
    } catch (error) {
      console.log("[Middleware] Failed to refreshed access token")
      console.error(error)
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
  }

  return NextResponse.next()
})

export const config = { matcher: ["/", "/assets/:path*", "/checkout/:path*", "/search"] }
