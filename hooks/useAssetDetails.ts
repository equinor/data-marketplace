import { useEffect, useState } from "react"

import { OverviewContentSections, ResponsibilitiesContentSections } from "../components/AssetTabContent"
import { HttpClient } from "../lib/HttpClient"

export const useAssetDetails = (assetId: string) => {
  const [overviewData, setOverviewData] = useState<OverviewContentSections>()
  const [responsibilitesData, setResponsibilitesData] = useState<ResponsibilitiesContentSections>()

  useEffect(() => {
    let ignore = false

    const getData = async () => {
      try {
        const overview = await HttpClient.get(`/api/assets/${assetId}/overview`, {
          headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
        })

        const responsibilities = await HttpClient.get(`/api/assets/${assetId}/responsibilities`, {
          headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
        })

        if (!ignore) {
          setOverviewData(overview.body)
          setResponsibilitesData(responsibilities.body)
        }
      } catch (err) {
        console.error("[AssetDetailView] Failed while getting asset", assetId)
      }
    }

    getData()

    return () => {
      ignore = true
    }
  }, [assetId])
  return { overviewData, responsibilitesData }
}
