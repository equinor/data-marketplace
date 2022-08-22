import type { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"

import { config } from "../../config"
import { HttpClient } from "../../lib/HttpClient"
import { HttpError } from "../../lib/HttpError"

type PopularAsset = Collibra.Asset & Pick<Collibra.NavigationStatistic, "numberOfViews">

const getPopularAssets = async (
  data: PopularAsset[],
  token: string,
  limit: number,
  offset = 0,
): Promise<PopularAsset[]> => {
  console.log("[getPopularAssets] token", token)

  const mostViewedStats = await HttpClient.get<Collibra.PagedNavigationStatisticResponse>(`${config.COLLIBRA_BASE_URL}/navigation/most_viewed`, {
    headers: { authorization: `Bearer ${token}` },
    query: { offset: offset * limit, limit, isGuestExcluded: true },
  })

  const assetsResponse = await Promise.all(
    mostViewedStats.body?.results.map((stat) => HttpClient.get<Collibra.Asset>(`${config.COLLIBRA_BASE_URL}/assets/${stat.assetId}`, {
      headers: { authorization: `Bearer ${token}` },
    })) ?? [],
  )

  const result = [
    ...data,
    ...assetsResponse
      .map((response) => response.body)
      .filter((response) => response?.type.name?.toLowerCase() === "data product")
      .map((product) => ({
        ...product,
        numberOfViews: mostViewedStats.body?.results.find((stat) => (
          stat.assetId === product?.id
        ))?.numberOfViews,
      })),
  ] as PopularAsset[]

  if (result.length >= limit) return result.slice(0, limit)

  return getPopularAssets(result, token, limit, offset + 1)
}

const PopularAssetsHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const token = await getToken({ req })

  if (!token) {
    return res.status(401).end()
  }

  const limit = Number.isNaN(Number(req.query.limit)) ? undefined : Number(req.query.limit)

  if (!limit) {
    console.log("[PopularAssetsHandler] Invalid limit param", req.query.limit)
    return res.status(400).end()
  }

  try {
    const dataProducts = await getPopularAssets([], token.accessToken as string, limit)

    return res.json(dataProducts)
  } catch (error) {
    console.log("[PopularAssetsHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default PopularAssetsHandler
