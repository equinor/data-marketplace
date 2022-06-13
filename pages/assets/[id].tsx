/* eslint-disable jsx-a11y/anchor-is-valid */
import { Typography } from "@equinor/eds-core-react"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { Container } from "../../components/Container"
import { HttpClient } from "../../lib/HttpClient"

const mapHashToApiEndpoint = (assetId: string, hash: string) => ({
  "#overview": `/api/assets/${assetId}/overview`,
  "#responsibilities": `/api/assets/${assetId}/responsibilities`,
})[hash]

const AssetDetailView: NextPage = () => {
  const [currentTab, setCurrentTab] = useState<string>("")

  const router = useRouter()

  useEffect(() => {
    if (router.query.id) {
      setCurrentTab(window.location.hash)
    }
  }, [router])

  useEffect(() => {
    if (currentTab && router.query.id) {
      const endpoint = mapHashToApiEndpoint(router.query.id as string, currentTab);

      (async () => {
        try {
          const res = await HttpClient.get(endpoint!, {
            headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
          })
          console.log(res)
        } catch (error) {
          console.error("[AssetDetailView] Failed while getting asset", router.query.id)
        }
      })()
    }
  }, [currentTab, router])

  return (
    <main>
      <Container>
        <aside>
          <nav>
            <ul>
              <li>
                <Link href="#overview">
                  <a>
                    Overview
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#responsibilities">
                  <a>
                    Responsibilities
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <Typography variant="h1_bold">Hello, World!</Typography>
      </Container>
    </main>
  )
}

export default AssetDetailView
