import type { NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"

import { Page } from "../components/Page"

const Frontpage: NextPage = () => {
  const [popularDataProducts, setPopularDataProducts] = useState<any[]>([])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/collibra/navigation/most_viewed?limit=6")
        const data = await res.json()
        setPopularDataProducts(data.results)
      } catch (error) {
        console.error("[Frontpage] Error while fetching most viewed data products", error)
      }
    })()

    return () => setPopularDataProducts([])
  }, [])

  return (
    <Page>
      <section>
        <div>
          <h1>Popular</h1>
          <Link href="/">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>See more</a>
          </Link>
        </div>
        <div>
          {popularDataProducts.map((product) => (
            <div key={product.assetId}>
              <p>{product.name}</p>
            </div>
          ))}
        </div>
      </section>
    </Page>
  )
}

export default Frontpage
