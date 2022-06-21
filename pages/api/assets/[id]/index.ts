import { NextApiHandler } from "next"

import { config } from "../../../../config"
import { HttpClient } from "../../../../lib/HttpClient"
import { HttpError } from "../../../../lib/HttpError"

const GetAssetByIDHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).end()
  } else {
    try {
      const assetRes = await HttpClient.get<Collibra.Asset>(`${config.COLLIBRA_BASE_URL}/assets/${req.query.id}`, {
        headers: { authorization: req.headers.authorization },
      })

      res.json(assetRes.body)
    } catch (error) {
      console.log("[GetAssetByIDHandler]", error)
      const err = error as HttpError
      res.status(err.statusCode ?? 500).json(err.body)
    }
  }
}

export default GetAssetByIDHandler
