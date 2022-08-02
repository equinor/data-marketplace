import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

import { HttpClient } from "../lib/HttpClient"
import { RootState } from "../store"

type CartContent = {
  id: string,
  name: string,
  description: string,
  domain?: string[]
}

export const useCartContent = () => {
  const [cartContent, setCartContent] = useState<CartContent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addedAssets = useSelector((state: RootState) => state.checkout.cart)

  useEffect(() => {
    let ignore = false

    const getData = async () => {
      setIsLoading(true)
      try {
        const allAssetNames = addedAssets.map(async (assetId) => {
          const assetCore = await HttpClient.get(`/api/assets/${assetId}`, {
            headers: { authorization: `Bearer: ${window.localStorage.getItem("access_token")}` },
          })

          const assetDetails = await HttpClient.get(`/api/assets/${assetId}/overview`, {
            headers: { authorization: `Bearer: ${window.localStorage.getItem("access_token")}` },
          })

          if (!ignore) {
            setCartContent((c) => {
              // We need to avoid duplicates, so let's just add this if the array doesn't
              // contain an asset object with the same id.
              // We should look into how we can improve data fetching without SSR
              if (!c.some((asset) => asset.id === assetId)) {
                const cartItems = [...c, {
                  id: assetId,
                  name: assetCore.body?.name,
                  description: assetDetails.body?.description,
                  domain: ["Some tag"],
                }]
                return cartItems.sort((a, b) => a.name.localeCompare(b.name))
              }
              return c
            })
          }
        })
        await Promise.all(allAssetNames)
        setIsLoading(false)
      } catch (error) {
        // @TODO: Improve the  flow with 401 Unauthorized
        setIsLoading(false)
        console.error("Failed while getting asset", error)
      }
    }

    getData()
    return () => {
      ignore = true
    }
  }, [addedAssets])
  return { cartContent, isLoading }
}
