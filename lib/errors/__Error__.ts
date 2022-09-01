import { ErrSource } from "./types"

export class __Error__ extends Error {
  private code: string

  constructor(message: string, source: ErrSource, code: string) {
    super(message)
    this.code = `E_${source}.${code}`
  }

  toString(): string {
    return `${this.code}: ${this.message}`
  }

  toJSON(): string {
    return this.toString()
  }
}
