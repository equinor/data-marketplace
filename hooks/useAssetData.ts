import { useEffect, useState } from "react"

import { HttpClient } from "../lib/HttpClient"

export const useAssetData = (id:string | undefined | string[]) => {
  // @TODO Are we able to type the asset data?
  const [assetData, setAssetData] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let ignore = false

    const getData = async () => {
      setIsLoading(true)
      try {
        const res = await HttpClient.get(`/api/assets/${id}`)
        if (!ignore) {
          setAssetData(res.body)
        }
        setIsLoading(false)
      } catch (err) {
        let msg: string = String(err)
        if (err instanceof Error) msg = err.message
        setError(msg)

        setIsLoading(false)
      }
    }

    if (id === undefined || Array.isArray(id)) {
      const message = "Id is undefined or array"
      setError(message)
    } else {
      getData()
    }

    return () => {
      ignore = true
    }
  }, [id, error])

  return { assetData, isLoading, error }
}
