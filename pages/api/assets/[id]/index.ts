import { NextApiHandler } from "next"

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

      res.json(assetRes.body)
    } catch (error) {
      res.status((error as any).statusCode ?? 500).end()
    }
  }
}

export default GetAssetByIDHandler
