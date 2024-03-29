import axios, { Axios, AxiosError } from "axios"

import { HttpError } from "./HttpError"

type HttpClientConfig = {
  baseURL?: string
  headers?: Record<string, any>
}

type HttpMethod = "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "PURGE" | "LINK" | "UNLINK"

interface HttpResponse<T> {
  statusCode: number
  statusMessage: string
  headers: Record<string, any>
  body: T
}

type HttpRequestConfig = {
  query?: Record<string, any>
  body?: any
  method?: HttpMethod
  headers?: Record<string, any>
}

export class __HttpClient__ {
  private client: Axios

  constructor(cfg?: HttpClientConfig) {
    this.client = axios.create(cfg)
  }

  private static serializeQuery(query: Record<string, any>): string {
    const params = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.append(key, value)
      }
    })

    return params.toString()
  }

  private async request<T>(url: string, config: HttpRequestConfig): Promise<HttpResponse<T>> {
    try {
      const res = await this.client.request<T>({
        data: config.body,
        headers: config.headers,
        method: config.method ?? "GET",
        params: config.query,
        paramsSerializer: {
          serialize: __HttpClient__.serializeQuery,
        },
        url,
      })

      // @TODO This console.log statement bloats the logs. A nice future improvement can be to add a verboose option
      /*    console.log(
        `${res.config.method?.toUpperCase()} ${res.config.baseURL}${res.config.url}${
          res.config.params ? `?${new URLSearchParams(res.config.params).toString()}` : ""
        }`
      ) */

      return {
        headers: res.headers,
        statusCode: res.status,
        statusMessage: res.statusText,
        body: res.data,
      }
    } catch (error) {
      const err = error as AxiosError

      if (err.isAxiosError) {
        throw new HttpError(err.message, err.response?.status ?? 500, err.response?.headers ?? {}, err.response?.data)
      }

      throw err
    }
  }

  public async get<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, "method" | "body">
  ): Promise<HttpResponse<T>> {
    return this.request(url, { ...config, method: "GET" })
  }

  public async post<T = any>(url: string, config?: Omit<HttpRequestConfig, "method">): Promise<HttpResponse<T>> {
    return this.request(url, { ...config, method: "POST" })
  }

  public async patch<T = any>(url: string, config?: Omit<HttpRequestConfig, "method">): Promise<HttpResponse<T>> {
    return this.request(url, { ...config, method: "PATCH" })
  }

  public async delete<T = any>(url: string, config?: Omit<HttpRequestConfig, "method">): Promise<HttpResponse<T>> {
    return this.request(url, { ...config, method: "DELETE" })
  }
}

export const HttpClient = new __HttpClient__()
