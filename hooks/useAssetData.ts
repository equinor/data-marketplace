import { useEffect, useState } from "react"

import { HttpClient } from "../lib/HttpClient"

export const useAssetData = (id:string | undefined | string[]) => {
  // @TODO Are we able to type the asset data?
  const [assetData, setAssetData] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let ignore = false

    const getData = async () => {
      setIsLoading(true)
      try {
        const res = await HttpClient.get(`/api/assets/${id}`, {
          headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
        })
        if (!ignore) {
          setAssetData(res.body)
        }
        setIsLoading(false)
      } catch (error) {
        console.error(`[AssetDetailView] Failed while getting asset ${id}`, error)
        setIsLoading(false)
      }
    }

    if (id === undefined || Array.isArray(id)) {
      console.log("[AssetDetailView] No id while getting asset", id)
    } else {
      getData()
    }

    return () => {
      ignore = true
    }
  }, [id])

  return { assetData, isLoading }
}
