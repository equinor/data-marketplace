import { STATUS_CODES } from "http"

import { NextApiHandler } from "next"
import xss from "xss"

import { config } from "../../config"
import { HttpClient } from "../../lib/HttpClient"
import { HttpError } from "../../lib/HttpError"

const SearchHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: STATUS_CODES[405] })
  } else {
    try {
      // get the status id of the approved status
      const approvedStatusRes = await HttpClient.get(`${config.COLLIBRA_BASE_URL}/statuses/name/Approved`, {
        headers: { authorization: req.headers.authorization },
      })

      const dataProductRes = await HttpClient.get(`${config.COLLIBRA_BASE_URL}/assetTypes`, {
        headers: { authorization: req.headers.authorization },
        query: { name: "data product" },
      })

      const filters = [
        { field: "status", values: [approvedStatusRes.body.id] },
        { field: "assetType", values: dataProductRes.body.results.map((result: any) => result.id) },
      ]

      if (req.query.community) {
        filters.push({
          field: "community",
          values: typeof req.query.community === "string"
            ? [req.query.community]
            : req.query.community,
        })
      }

      // get search results
      const searchRes = await HttpClient.post<{ results: any[] }>(`${config.COLLIBRA_BASE_URL}/search`, {
        headers: { authorization: req.headers.authorization },
        body: {
          keywords: req.query.q,
          filters,
        },
      })

      // get description attributes for all assets returned from search
      const attrs = await Promise.all(searchRes.body?.results.map((result: any) => (
        HttpClient.get(`${config.COLLIBRA_BASE_URL}/attributes`, {
          headers: { authorization: req.headers.authorization },
          query: { assetId: result.resource.id },
        })
      )) ?? [])

      const descriptions: Record<string, string> = {}
      attrs.forEach((attr: any) => {
        const description = attr.body.results.find((a: any) => a.type.name.toLowerCase() === "description")?.value
        descriptions[attr.body.results[0]?.asset.id] = xss(description)
      })

      const results = searchRes.body?.results.map((result) => ({
        resource: {
          ...result.resource,
          description: descriptions[result.resource.id],
        },
      }))

      res.json({
        ...searchRes.body,
        results,
      })
    } catch (error) {
      console.log("[SearchHandler]", error)
      const err = error as HttpError
      res.status(err.statusCode ?? 500).json(err.body)
    }
  }
}

export default SearchHandler
