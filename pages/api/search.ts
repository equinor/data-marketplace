import { STATUS_CODES } from "http"

import { NextApiHandler } from "next"

import { config } from "config"
import { HttpError } from "lib/HttpError"
import { request } from "lib/net/request"

const SearchHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: STATUS_CODES[405] })
  }

  try {
    const approvedStatusRes = await request(`${config.COLLIBRA_API_URL}/statuses/name/Approved`, { retries: 3 })({
      req,
    })
    const approvedStatus: Collibra.Status = await approvedStatusRes.json()

    const dataProductRes = await request(`${config.COLLIBRA_API_URL}/assetTypes?name=data%20product`, { retries: 3 })({
      req,
    })
    const dataProduct: Collibra.PagedAssetResponse = await dataProductRes.json()

    const filters = [
      { field: "status", values: [approvedStatus.id] },
      {
        field: "assetType",
        values: dataProduct.results.map((result) => result.id),
      },
    ]

    if (req.query.community) {
      filters.push({
        field: "community",
        values: typeof req.query.community === "string" ? [req.query.community] : req.query.community,
      })
    }

    const limit = 20
    const offset = limit * (Number.isNaN(Number(req.query.offset)) ? 0 : Number(req.query.offset))

    const searchRes = await request(`${config.COLLIBRA_API_URL}/search`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        keywords: req.query.q! as string,
        filters,
        limit: limit.toString(),
        offset: offset.toString(),
      }),
      retries: 3,
    })({ req })

    const searchResults: Collibra.SearchResponse = await searchRes.json()

    const results = searchResults.results.map((result) => ({
      resource: {
        ...result.resource,
      },
    }))

    return res.json({
      ...searchResults,
      results,
    })
  } catch (error) {
    /* eslint-disable no-console */
    console.log("[SearchHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default SearchHandler
