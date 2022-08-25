import { useEffect, useState } from "react"

import { OverviewContentSections, ResponsibilitiesContentSections } from "../components/AssetTabContent"
import { HttpClient } from "../lib/HttpClient"

export const useAssetDetails = (assetId: string) => {
  const [overviewData, setOverviewData] = useState<OverviewContentSections>()
  const [responsibilitesData, setResponsibilitesData] = useState<ResponsibilitiesContentSections>()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()
  useEffect(() => {
    let ignore = false

    const getData = async () => {
      setIsLoading(true)
      try {
        const overview = await HttpClient.get(`/api/assets/${assetId}/overview`)

        const responsibilities = await HttpClient.get(`/api/assets/${assetId}/responsibilities`, {
          headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
        })

        if (!ignore) {
          setOverviewData(overview.body)
          setResponsibilitesData(responsibilities.body)
        }
        setIsLoading(false)
      } catch (err) {
        let msg: string = String(err)
        if (err instanceof Error) msg = err.message
        setError(msg)

        setIsLoading(false)
        console.error("[AssetDetailView] Failed while getting asset", assetId)
      }
    }

    getData()

    return () => {
      ignore = true
    }
  }, [assetId, error])
  return {
    overviewData, responsibilitesData, isLoading, error,
  }
}
