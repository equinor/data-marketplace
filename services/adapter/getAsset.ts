import type { Asset } from "@equinor/data-marketplace-models"

import { config } from "config"
import type { __HttpClient__ } from "lib/HttpClient"

export const getAsset = (client: __HttpClient__) => async (id: string) => {
  const { body } = await client.get<Asset>(`/assets/${id}`, {
    query: {
      code: config.ADAPTER_SERVICE_APP_KEY,
    },
  })
  return body
}
