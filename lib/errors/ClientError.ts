import { __Error__ } from "./__Error__"
import { ErrSource } from "./types"

export class ClientError extends __Error__ {
  constructor(message: string, code: string, details?: any) {
    super(message, ErrSource.Client, code, details)
  }
}
