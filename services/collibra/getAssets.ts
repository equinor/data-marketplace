import { ERR_CODES, ExternalError } from "lib/errors"
import { Asset } from "model/Asset"
import { ServiceRequester } from "services"

export const getAssets: ServiceRequester<Asset[]> = (client) => (
  async (query: Collibra.AssetQueryParams) => {
    const res = await client.get<Collibra.PagedAssetResponse>("/assets", {
      query,
    })

    if (res.body.total === 0) {
      throw new ExternalError(`No assets found matching the query ${JSON.stringify(query)}`, ERR_CODES.MISSING_DATA)
    }

    return res.body.results.map(Asset.fromCollibraAsset)
  }
)
