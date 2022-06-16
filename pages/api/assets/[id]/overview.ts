import { NextApiHandler } from "next"
import xss from "xss"

import { config } from "../../../../config"
import { HttpClient } from "../../../../lib/HttpClient"

const GetAssetOverview: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).end()
  } else {
    try {
      const attrsRes = await HttpClient.get<Collibra.PagedAttributeResponse>(`${config.COLLIBRA_BASE_URL}/attributes`, {
        headers: { authorization: req.headers.authorization },
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

      res.json(attrs)
    } catch (error) {
      res.status((error as any).statusCode ?? 500).end()
    }
  }
}

export default GetAssetOverview
