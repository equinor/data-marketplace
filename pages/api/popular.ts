import type { NextApiHandler } from "next"

import { config } from "../../config"
import { HttpClient } from "../../lib/HttpClient"

const getPopularAssets = async (
  data: any[],
  auth: string,
  limit: number,
): Promise<any[]> => {
  const mostViewedStats = await HttpClient.get(`${config.COLLIBRA_BASE_URL}/navigation/most_viewed`, {
    headers: { authorization: auth },
    query: { limit, isGuestExcluded: true },
  })

  const assetsResponse = await Promise.all(
    mostViewedStats.body.results.map((stat: any) => HttpClient.get(`${config.COLLIBRA_BASE_URL}/assets/${stat.assetId}`, {
      headers: { authorization: auth },
    })),
  )

  const result = [
    ...data,
    ...assetsResponse
      .map((response) => response.body)
      .filter((response) => response.type?.name.toLowerCase() === "data product")
      .map((product) => ({
        ...product,
        numberOfViews: mostViewedStats.body.results.find((stat: any) => (
          stat.assetId === product.id
        )).numberOfViews,
      })),
  ]

  if (result.length >= limit) return result.slice(0, limit)

  return getPopularAssets(result, auth, limit)
}

const PopularAssetsHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).end()
    return
  }

  const limit = Number.isNaN(Number(req.query.limit)) ? undefined : Number(req.query.limit)

  if (!limit) {
    console.log("[PopularAssetsHandler] Invalid limit param", req.query.limit)
    res.status(400).end()
    return
  }

  try {
    const dataProducts = await getPopularAssets([], req.headers.authorization!, limit)

    res.json(dataProducts)
  } catch (error) {
    console.log("[PopularAssetsHandler]", error)
    res.status(500).end()
  }
}

export default PopularAssetsHandler
