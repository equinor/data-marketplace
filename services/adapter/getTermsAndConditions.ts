import type { RightsToUse } from "@equinor/data-marketplace-models"

import { config } from "config"
import type { __HttpClient__ } from "lib/HttpClient"

export const getTermsAndConditions = (client: __HttpClient__) => async (id: string) => {
  const { body } = await client.get<RightsToUse>(`/assets/${id}/terms`, {
    query: {
      code: config.ADAPTER_SERVICE_APP_KEY,
    },
  })
  return body
}
