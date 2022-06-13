import axios, { Axios, AxiosError } from "axios"
import qs from "query-string"

type HttpMethod = "GET"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "POST"
  | "PUT"
  | "PATCH"
  | "PURGE"
  | "LINK"
  | "UNLINK"

interface HttpResponse<T> {
  statusCode: number
  statusMessage: string
  headers: Record<string, any>
  body?: T
}

type HttpRequestConfig = {
  query?: Record<string, any>
  body?: any
  method?: HttpMethod,
  headers?: Record<string, any>
}

export interface HttpError {
  body?: any
  headers: Record<string, any>
  statusCode: number
  statusMessage: string
}

export class HttpClient {
  private static instance: Axios

  private static getInstance(): Axios {
    if (!HttpClient.instance) {
      HttpClient.instance = axios.create()
    }
    return HttpClient.instance
  }

  private static async request<T>(
    url: string,
    config: HttpRequestConfig,
  ): Promise<HttpResponse<T>> {
    try {
      const res = await HttpClient.getInstance().request({
        data: config.body,
        headers: config.headers,
        method: config.method ?? "GET",
        params: config.query,
        paramsSerializer: (params: Record<string, any>) => qs.stringify(params, { arrayFormat: "none" }),
        url,
      })

      return {
        headers: res.headers,
        statusCode: res.status,
        statusMessage: res.statusText,
        body: res.data,
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        throw Object.assign(new Error(`${error.config.method?.toUpperCase()} request to ${error.config.url} failed: ${error.response?.status} (${error.response?.statusText})`), {
          body: error.response?.data,
          code: error.code,
          headers: error.response?.headers,
          statusCode: error.response?.status,
          statusMessage: error.response?.statusText,
        })
      }
      throw error
    }
  }

  public static async get<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, "method" | "body">,
  ): Promise<HttpResponse<T>> {
    return HttpClient.request(url, { ...config, method: "GET" })
  }

  public static async post<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, "method">,
  ): Promise<HttpResponse<T>> {
    return HttpClient.request(url, { ...config, method: "POST" })
  }

  public static async patch<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, "method">,
  ): Promise<HttpResponse<T>> {
    return HttpClient.request(url, { ...config, method: "PATCH" })
  }

  public static async delete<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, "method">,
  ): Promise<HttpResponse<T>> {
    return HttpClient.request(url, { ...config, method: "DELETE" })
  }
}
