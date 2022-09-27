import type { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import xss from "xss"

import { HttpError } from "lib/HttpError"
import { Asset } from "model/Asset"
import { makeCollibraService } from "services"
import { getAssetAttributes } from "services/collibra"

type PopularAsset = Asset & Pick<Collibra.NavigationStatistic, "numberOfViews">

const getPopularAssets = async (
  data: PopularAsset[],
  makeRequest: ReturnType<typeof makeCollibraService>,
  limit: number,
  offset = 0,
): Promise<PopularAsset[]> => {
  const { body: { results: stats } } = await makeRequest((client) => async () => client.get<Collibra.PagedNavigationStatisticResponse>("/navigation/most_viewed", {
    query: {
      limit,
      offset: offset * limit,
    },
  }))()

  const collibraAssets = await Promise.all(
    stats.map((stat) => makeRequest((client) => async (id: string) => client.get<Collibra.Asset>(`/assets/${id}`))(stat.assetId)),
  )

  const assets = collibraAssets
    .map((res) => res.body)
    .filter((asset) => asset.type.name.toLowerCase() === "data product")
    .map((asset) => Asset.fromCollibraAsset(asset))

  const assetsWithDescription = await Promise.all(assets.map(async (asset) => ({
    ...asset,
    description: xss((await makeRequest(getAssetAttributes)(asset.id, "description"))
      .find((attr) => attr.type.name.toLowerCase() === "description")?.value),
  })))

  const assetsWithNumberOfViews = assetsWithDescription.map((asset) => ({
    ...asset,
    numberOfViews: stats.find((stat) => stat.assetId === asset.id)?.numberOfViews ?? 0,
  }))

  const results = [
    ...data,
    ...assetsWithNumberOfViews,
  ]

  if (results.length >= limit) return results.slice(0, limit)

  return getPopularAssets(results, makeRequest, limit, offset + 1)
}

const PopularAssetsHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const token = await getToken({ req })

  if (!token) {
    return res.status(401).end()
  }

  const makeCollibraServiceRequest = makeCollibraService({ authorization: `Bearer ${token.accessToken}` })

  const limit = Number.isNaN(Number(req.query.limit)) ? undefined : Number(req.query.limit)

  if (!limit) {
    console.log("[PopularAssetsHandler] Invalid limit param", req.query.limit)
    return res.status(400).end()
  }

  try {
    const dataProducts = await getPopularAssets([], makeCollibraServiceRequest, limit)

    return res.json(dataProducts)
  } catch (error) {
    console.log("[PopularAssetsHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default PopularAssetsHandler
