import { Typography } from "@equinor/eds-core-react"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

import { Container } from "../../components/Container"
import { HttpClient } from "../../lib/HttpClient"

const AssetDetailView: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    if (router.query.id) {
      (async () => {
        try {
          const res = await HttpClient.get(`/api/assets/${router.query.id}`, {
            headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
          })
          console.log(res)
        } catch (error) {
          console.error("[AssetDetailView] Failed while getting asset", router.query.id)
        }
      })()
    }
  }, [router])

  return (
    <main>
      <Container>
        <Typography variant="h1_bold">Hello, World!</Typography>
      </Container>
    </main>
  )
}

export default AssetDetailView
