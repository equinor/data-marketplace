import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"

import { config } from "../../config"
import { HttpClient } from "../../lib/HttpClient"
import { HttpError } from "../../lib/HttpError"

const CommunitiesHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const token = await getToken({ req })

  if (!token) {
    return res.status(401).end()
  }

  const authorization = `Bearer ${token.accessToken}`

  try {
    const allComunities = await HttpClient.get<Collibra.PagedCommunityResponse>(`${config.COLLIBRA_BASE_URL}/communities`, {
      headers: { authorization },
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
      headers: { authorization },
      query: { parentId: equinorCommunity.id },
    })

    return res.json(communities.body?.results)
  } catch (error) {
    console.log("[CommunitiesHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default CommunitiesHandler
