import { NextApiHandler } from "next"

import { config } from "../../config"
import { HttpClient } from "../../lib/HttpClient"

const CommunitiesHandler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET": {
      const allComunities = await HttpClient.get<Collibra.PagedCommunityResponse>(`${config.COLLIBRA_BASE_URL}/communities`, {
        headers: { authorization: req.headers.authorization },
        query: {
          name: "equinor",
          nameMatchMode: "ANYWHERE",
        },
      })

      const equinorCommunity = allComunities.body?.results[0]

      if (!equinorCommunity) {
        return res.status(500).end()
      }

      const communities = await HttpClient.get<Collibra.PagedCommunityResponse>(`${config.COLLIBRA_BASE_URL}/communities`, {
        headers: { authorization: req.headers.authorization },
        query: { parentId: equinorCommunity.id },
      })

      return res.json(communities.body?.results)
    }
    default:
      return res.status(405).end()
  }
}

export default CommunitiesHandler
