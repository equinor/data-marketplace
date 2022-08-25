import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import xss from "xss"

import { config } from "../../../../config"
import { HttpClient } from "../../../../lib/HttpClient"
import { HttpError } from "../../../../lib/HttpError"

const GetAssetOverview: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const token = await getToken({ req })

  if (!token) {
    return res.status(401).end()
  }

  const authorization = `Bearer ${token.accessToken}`

  try {
    const attrsRes = await HttpClient.get<Collibra.PagedAttributeResponse>(`${config.COLLIBRA_BASE_URL}/attributes`, {
      headers: { authorization },
      query: { assetId: req.query.id },
    })

    const attrs = attrsRes.body?.results.filter((attr) => [
      "description",
      "purpose",
      "timeliness",
    ].includes(attr.type.name!.toLowerCase())).reduce((obj, attr) => ({
      ...obj,
      [attr.type.name!.toLowerCase().replace(/\s/g, "_")]: xss(attr.value),
    }), {})

    return res.json(attrs)
  } catch (error) {
    console.log("[GetAssetOverviewHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default GetAssetOverview
