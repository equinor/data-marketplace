import { Asset } from "model/Asset"
import { ServiceRequester } from "services"

export const getAssetByID: ServiceRequester<Asset> = (client) => async (id: string) => {
  const { body: asset } = await client.get<Collibra.Asset>(`/assets/${id}`)
  return Asset.fromCollibraAsset(asset)
}
