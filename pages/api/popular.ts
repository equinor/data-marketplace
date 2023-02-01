import type { Asset } from "@equinor/data-marketplace-models"
import type { NextApiHandler } from "next"

import { config } from "config"
import { HttpError } from "lib/HttpError"
import { request } from "lib/net/request"

const PopularAssetsHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  try {
    const response = await request(
      `${config.ADAPTER_SERVICE_API_URL}/lists/popular?code=${config.ADAPTER_SERVICE_APP_KEY}&limit=6`,
      { retries: 3 }
    )({ req })

    const popularDataProducts = (await response.json()) as Asset[]

    return res.json(popularDataProducts)
  } catch (error) {
    /* eslint-disable no-console */
    console.log("[PopularAssetsHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default PopularAssetsHandler
