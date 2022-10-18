import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { HttpClient } from "../lib/HttpClient"

type SearchResult = {
  resource: Collibra.Asset
}

export const useSearchResults = () => {
  const router = useRouter()
  const [searchResults, setSearchResults] = useState<Collibra.Asset[]>()
  const [total, setTotal] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let ignore = false

    const getData = async () => {
      if (router.query.q) {
        setIsLoading(true)
        try {
          const { body } = await HttpClient.get("/api/search", { query: router.query })
          if (!ignore) {
            setSearchResults(body.results.map((result: SearchResult) => result.resource))
            setTotal(body.total)
          }
          setIsLoading(false)
        } catch (err) {
          let msg: string = String(err)
          if (err instanceof Error) msg = err.message
          setError(msg)
          setIsLoading(false)
        }
      }
    }

    getData()

    return () => {
      ignore = true
    }
  }, [router, error])

  return {
    searchResults,
    total,
    isLoading,
    error,
  }
}
