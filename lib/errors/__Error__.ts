import { ErrSource } from "./types"

export class __Error__ extends Error {
  code: string
  details?: any

  constructor(message: string, source: ErrSource, code: string, details?: any) {
    super(message)
    this.code = `E${source}${code}`
    this.details = details
  }

  toString(): string {
    return `${this.code}: ${this.message}`
  }

  toJSON(): string {
    return this.toString()
  }
}
