import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js"
import { SeverityLevel } from "@microsoft/applicationinsights-web"
import { useEffect, useState } from "react"

import { HttpClient } from "../lib/HttpClient"

export const usePopularProducts = () => {
  const [popularDataProducts, setPopularDataProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  const appInsights = useAppInsightsContext()

  useEffect(() => {
    let ignore = false

    const getProducts = async () => {
      setIsLoading(true)
      try {
        const { body } = await HttpClient.get("/api/popular", { query: { limit: 6 } })
        if (!ignore) {
          setPopularDataProducts(body)
        }
        setIsLoading(false)
      } catch (err) {
        let msg: string = String(err)
        if (err instanceof Error) {
          appInsights.trackException({
            error: err,
            severityLevel: SeverityLevel.Error,
          })
          msg = err.message
        }
        setError(msg)
        setIsLoading(false)
      }
    }

    getProducts()

    return () => {
      ignore = true
    }
  }, [error, appInsights])

  return {
    popularDataProducts,
    isLoading,
    error,
  }
}
