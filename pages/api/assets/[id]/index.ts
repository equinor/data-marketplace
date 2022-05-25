import { NextApiHandler } from "next"
import xss from "xss"

import { config } from "../../../../config"
import { HttpClient } from "../../../../lib/HttpClient"

const GetAssetByIDHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).end()
  } else {
    try {
      const assetRes = await HttpClient.get(`${config.COLLIBRA_BASE_URL}/assets/${req.query.id}`, {
        headers: { authorization: req.headers.authorization },
      })

      const attrsRes = await HttpClient.get(`${config.COLLIBRA_BASE_URL}/attributes`, {
        headers: { authorization: req.headers.authorization },
        query: { assetId: req.query.id },
      })

      const attrs = attrsRes.body.results.filter((attr: any) => [
        "purpose",
        "timeliness",
        "description",
      ].includes(attr.type.name.toLowerCase())).map((attr: any) => ({
        type: attr.type.name.toUpperCase().split(" ").join("_"),
        value: xss(attr.value),
      }))

      res.json({
        ...assetRes.body,
        attributes: attrs,
      })
    } catch (error) {
      res.status((error as any).statusCode ?? 500).end()
    }
  }
}

export default GetAssetByIDHandler
