import jwt, { Jwt } from "jsonwebtoken"
import { NextApiRequest, NextApiResponse } from "next"
import { config } from "../../../config"
import { HttpClient } from "../../../lib/HttpClient"

export default async function issueAccessTokenHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  if (!req.body.id_token) {
    return res.status(400).end()
  }

  try {
    // decode id_token
    const decodedToken = jwt.decode(req.body.id_token, { json: true, complete: true }) as Jwt

    // verify token by calling keys endpoint and comparing kid
    const keysResponse = await HttpClient.get(`https://login.microsoftonline.com/${config.AUTH_TENANT_ID}/discovery/keys`, {
      query: { appid: config.AUTH_CLIENT_ID },
    })

    const hasMatchingKid = keysResponse.body.keys.some((key: Record<string, string>) => (
      key.kid === decodedToken.header.kid
    ))

    if (!hasMatchingKid) {
      console.log("[issueAccessTokenHandler] no matching key ID")
      return res.status(400).end()
    }

    const tokenResponse = await HttpClient.post(`https://login.microsoftonline.com/${config.AUTH_TENANT_ID}/oauth2/v2.0/token`, {
      headers: new Headers({ "Content-Type": "application/x-www-form-urlencoded" }),
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: config.AUTH_CLIENT_ID,
        scope: "f56404ce-575e-4866-afa8-647e36626d02/.default",
        client_secret: config.AUTH_CLIENT_SECRET,
      }),
    })

    return res.json({ access_token: tokenResponse.body.access_token })
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}
