import { __Error__ } from "./__Error__"
import { ErrSource } from "./types"

/**
 * ExternalError should be thrown when for example a call to an
 * external service returns unexpected data or fails outright.
 */
export class ExternalError extends __Error__ {
  constructor(message: string, code: string, details?: any) {
    super(message, ErrSource.External, code, details)
  }
}
