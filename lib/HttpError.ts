import { STATUS_CODES } from "http"

export class HttpError extends Error {
  body?: any
  headers: Record<string, any>
  statusCode: number
  statusMessage: string

  constructor(message: string, statusCode: number, headers: Record<string, any>, body?: any) {
    super(message)

    this.body = body
    this.headers = headers
    this.statusCode = statusCode
    this.statusMessage = STATUS_CODES[statusCode]!
  }
}
