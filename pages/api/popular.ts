import type { Asset } from "@equinor/data-marketplace-models"
import axios from "axios"
import type { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"

import { config } from "config"
import { HttpError } from "lib/HttpError"

const PopularAssetsHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const token = await getToken({ req })

  if (!token) {
    return res.status(401).end()
  }

  try {
    const adapterServiceClient = axios.create({
      baseURL: (config.ADAPTER_SERVICE_API_URL as string) ?? "",
      headers: {
        authorization: `Bearer ${token.accessToken}`,
      },
      params: {
        code: config.ADAPTER_SERVICE_APP_KEY,
        limit: 6,
      },
    })

    const { data: popularDataProducts } = await adapterServiceClient.get<Asset>("/lists/popular")

    return res.json(popularDataProducts)
  } catch (error) {
    console.log("[PopularAssetsHandler]", error)
    const err = error as HttpError
    return res.status(err.statusCode ?? 500).json(err.body)
  }
}

export default PopularAssetsHandler
