import { STATUS_CODES } from "http"

import { Asset } from "@equinor/data-marketplace-models"
import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"

import { config } from "config"
import { HttpClient } from "lib/HttpClient"
import { HttpError } from "lib/HttpError"

type SearchResult = {
  resource: Asset
}

const SearchHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: STATUS_CODES[405] })
  }

  const token = await getToken({ req })

  if (!token) return res.status(401).end()

  const authorization = `Bearer ${token.accessToken}`

  try {
    // get the status id of the approved status
    const approvedStatusRes = await HttpClient.get(`${config.COLLIBRA_API_URL}/statuses/name/Approved`, {
      headers: { authorization },
    })

    const dataProductRes = await HttpClient.get(`${config.COLLIBRA_API_URL}/assetTypes`, {
      headers: { authorization },
      query: { name: "data product" },
    })

    const filters = [
      { field: "status", values: [approvedStatusRes.body.id] },
      {
        field: "assetType",
        values: dataProductRes.body.results.map((result: any) => result.id),
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

    // get search results
    const searchRes = await HttpClient.post<{ results: SearchResult[] }>(`${config.COLLIBRA_API_URL}/search`, {
      headers: { authorization },
      body: {
        keywords: req.query.q,
        filters,
        limit,
        offset,
      },
    })

    const results = searchRes.body?.results.map((result: SearchResult) => ({
      resource: {
        ...result.resource,
      },
    }))

    return res.json({
      ...searchRes.body,
      results,
    })
  } catch (error) {
    console.log("[SearchHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default SearchHandler
