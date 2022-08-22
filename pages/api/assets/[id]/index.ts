import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"

import { config } from "../../../../config"
import { HttpClient } from "../../../../lib/HttpClient"
import { HttpError } from "../../../../lib/HttpError"

const GetAssetByIDHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const token = await getToken({ req })

  if (!token) {
    return res.status(401).end()
  }

  const authorization = `Bearer ${token}`

  try {
    const assetRes = await HttpClient.get<Collibra.Asset>(`${config.COLLIBRA_BASE_URL}/assets/${req.query.id}`, {
      headers: { authorization },
    })

    return res.json(assetRes.body)
  } catch (error) {
    console.log("[GetAssetByIDHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default GetAssetByIDHandler
