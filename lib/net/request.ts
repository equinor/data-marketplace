import { HttpError } from "lib/HttpError"

type ReqInit = RequestInit & {
  retries?: number
}

export const request =
  (url: string, init?: ReqInit) =>
  async (token: string): Promise<Response> => {
    const req = new Request(url, {
      redirect: "follow",
      ...init,
    })

    req.headers.set("Authorization", `Bearer ${token}`)

    const res = await fetch(req)

    if (res.status === 401 && init?.retries && init.retries > 0) {
      return request(req.url, {
        ...req,
        retries: init.retries - 1,
      })(token)
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
