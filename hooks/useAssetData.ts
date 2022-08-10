import { useEffect, useState } from "react"

import { HttpClient } from "../lib/HttpClient"

type ErrorMessage= {
  message: string
}

export const useAssetData = (id:string | undefined | string[]) => {
  // @TODO Are we able to type the asset data?
  const [assetData, setAssetData] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ErrorMessage | null>(null)

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
      } catch (err) {
        let message
        if (err instanceof Error) message = err.message
        else message = String(error)

        setError({ message })
        setIsLoading(false)
      }
    }

    if (id === undefined || Array.isArray(id)) {
      const message = "Id is undefined or array"
      setError({ message })
    } else {
      getData()
    }

    return () => {
      ignore = true
    }
  }, [id, error])

  return { assetData, isLoading, error }
}
