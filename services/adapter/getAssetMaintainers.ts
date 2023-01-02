import type { Maintainer } from "@equinor/data-marketplace-models"

import type { __HttpClient__ } from "lib/HttpClient"

export const getAssetMaintainers = (client: __HttpClient__) => async (assetID: string) => {
  const { body } = await client.get<Maintainer[]>(`/assets/${assetID}/maintainers`)
  return body
}
