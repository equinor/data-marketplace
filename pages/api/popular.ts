import type { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"

import { config } from "config"
import { HttpClient } from "lib/HttpClient"
import { HttpError } from "lib/HttpError"

type PopularAsset = Collibra.Asset & Pick<Collibra.NavigationStatistic, "numberOfViews">

const getPopularAssets = async (
  data: PopularAsset[],
  authorization: string,
  approvedStatusId: string,
  typeId: string,
  limit: number,
  offset = 0,
): Promise<PopularAsset[]> => {
  const mostViewedStats = await HttpClient.get<Collibra.PagedNavigationStatisticResponse>(`${config.COLLIBRA_BASE_URL}/navigation/most_viewed`, {
    headers: { authorization },
    query: { offset: offset * limit, limit, isGuestExcluded: true },
  })

  const assetsResponse = await Promise.all(
    mostViewedStats.body?.results.map((stat) => HttpClient.get<Collibra.PagedAssetResponse>(`${config.COLLIBRA_BASE_URL}/assets`, {
      headers: { authorization },
      query: {
        name: stat.name,
        nameMatchMode: "EXACT",
        statusIds: [approvedStatusId],
        typeIds: [typeId],
      },
    })) ?? [],
  )

  const result = [
    ...data,
    ...assetsResponse
      .flatMap((response) => response.body.results.map((asset) => ({
        ...asset,
        numberOfViews: mostViewedStats.body?.results.find((stat) => (
          stat.assetId === asset.id
        ))?.numberOfViews,
      }))),
  ] as PopularAsset[]

  if (result.length >= limit) return result.slice(0, limit)

  return getPopularAssets(result, authorization, approvedStatusId, typeId, limit, offset + 1)
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
    const authString = `Bearer ${token.accessToken}`
    const approvedStatusResp = await HttpClient.get<Collibra.Status>(`${config.COLLIBRA_BASE_URL}/statuses/name/Approved`, {
      headers: { authorization: authString },
    })

    const dataProductTypeIdRes = await HttpClient.get<Collibra.PagedAssetTypeResponse>(`${config.COLLIBRA_BASE_URL}/assetTypes`, {
      headers: { authorization: authString },
      query: { name: "data product" },
    })

    if (dataProductTypeIdRes.body.results[0]?.id === "undefined") {
      return res.status(500).end()
    }
    const dataProducts = await getPopularAssets(
      [],
      authString,
      approvedStatusResp.body.id,
      dataProductTypeIdRes.body.results[0]?.id,
      limit,
    )

    return res.json(dataProducts)
  } catch (error) {
    console.log("[PopularAssetsHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default PopularAssetsHandler
