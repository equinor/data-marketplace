import type { Asset } from "@equinor/data-marketplace-models"
import type { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"

import { config } from "config"
import { HttpError } from "lib/HttpError"

const PopularAssetsHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  let session = await getToken({ req })

  if (!session) {
    return res.status(401).end()
  }

  try {
    // const adapterServiceClient = axios.create({
    //   baseURL: (config.ADAPTER_SERVICE_API_URL as string) ?? "",
    //   headers: {
    //     authorization: `Bearer ${token.accessToken}`,
    //   },
    //   params: {
    //     code: config.ADAPTER_SERVICE_APP_KEY,
    //     limit: 6,
    //   },
    // })

    // const { data: popularDataProducts } = await adapterServiceClient.get<Asset>("/lists/popular")

    const response = await fetch(
      `${config.ADAPTER_SERVICE_API_URL}/lists/popular?code=${config.ADAPTER_SERVICE_APP_KEY}&limit=6`,
      {
        headers: {
          authorization: `Bearer ${session.accessToken}`,
        },
      }
    )
    if (response.status === 401) {
      session = await getToken({ req })
    }

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
