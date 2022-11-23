import { OutgoingHttpHeader } from "http"

import { config } from "config"
import { __HttpClient__ } from "lib/HttpClient"

export type ServiceRequester<T> = (client: __HttpClient__) => (...v: any) => Promise<T>

type Headers = Record<string, OutgoingHttpHeader>

const makeService = (baseURL: string) => (defaultHeaders?: Headers) => (headers?: Headers) => {
  const client = new __HttpClient__({
    baseURL,
    headers: {
      ...defaultHeaders,
      ...(headers || {}),
    },
  })

  return <T>(request: ServiceRequester<T>) => request(client)
}

export const makeCollibraService = makeService(config.COLLIBRA_BASE_URL as string)({ accept: "application/json" })
