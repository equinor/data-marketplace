import { getToken, type JWT, type GetTokenParams } from "next-auth/jwt"

import { HttpError } from "lib/HttpError"

type ReqInit = RequestInit & {
  retries?: number
}

export const request =
  (url: string, init?: ReqInit) =>
  async (sessionParams?: GetTokenParams): Promise<Response> => {
    const req = new Request(url, {
      redirect: "follow",
      ...init,
    })

    let session: JWT | undefined

    if (sessionParams) {
      session = (await getToken(sessionParams)) as JWT
      req.headers.set("Authorization", `Bearer ${session.accessToken}`)
    }

    const res = await fetch(req)

    if (res.status === 401 && init?.retries && init.retries > 0) {
      return request(req.url, {
        ...req,
        retries: init.retries - 1,
      })(sessionParams)
    }

    if (!res.ok && !init?.retries) {
      throw new HttpError(
        `${req.method} to ${req.url} failed with ${res.status} (${res.statusText})`,
        res.status,
        res.headers
      )
    }

    return res
  }
