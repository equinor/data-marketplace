import { __Error__ } from "./__Error__"
import { ErrSource } from "./types"

export class InternalError extends __Error__ {
  constructor(message: string, code: string) {
    super(message, ErrSource.Internal, code)
  }
}
