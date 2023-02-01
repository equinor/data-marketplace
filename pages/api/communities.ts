import { NextApiHandler } from "next"

import { config } from "config"
import { HttpError } from "lib/HttpError"
import { request } from "lib/net/request"

const CommunitiesHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  try {
    const communitiesParams = new URLSearchParams({ name: "equinor", nameMatchMode: "ANYWHERE" }).toString()

    const allCommunitiesRes = await request(`${config.COLLIBRA_API_URL}/communities?${communitiesParams}`, {
      retries: 3,
    })({ req })
    const allComunities: Collibra.PagedCommunityResponse = await allCommunitiesRes.json()

    const equinorCommunity = allComunities.results[0]

    if (!equinorCommunity) {
      return res.status(500).end()
    }

    const communitiesRes = await request(`${config.COLLIBRA_API_URL}/communities?parentId=${equinorCommunity.id}`)({
      req,
    })
    const communities: Collibra.PagedCommunityResponse = await communitiesRes.json()

    return res.json(communities.results)
  } catch (error) {
    /* eslint-disable no-console  */
    console.log("[CommunitiesHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default CommunitiesHandler
