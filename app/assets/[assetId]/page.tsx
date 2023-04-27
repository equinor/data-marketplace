/* eslint-disable camelcase */
import type { Asset, Maintainer } from "@equinor/data-marketplace-models"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { AssetPageHeader } from "./Header"
import { AssetPageTabs } from "./Tabs"

import { Container } from "components/Container"
import { config } from "config"
import { getSession } from "lib/getSession"
import { request } from "lib/net/request"

const getAssetData = (assetId: string) => async (token: string) => {
  const assetRes = await request(
    `${config.ADAPTER_SERVICE_API_URL}/assets/${assetId}?code=${config.ADAPTER_SERVICE_APP_KEY}`,
    { retries: 3 }
  )(token)
  const asset: Asset = await assetRes.json()

  const maintainersRes = await request(
    `${config.ADAPTER_SERVICE_API_URL}/assets/${assetId}/maintainers?code=${config.ADAPTER_SERVICE_APP_KEY}&group=Data Steward,Technical Steward`,
    { retries: 3 }
  )(token)

  const maintainers: Maintainer[] = await maintainersRes.json()

  const responsibilities = Array.isArray(maintainers)
    ? maintainers.reduce((maintainerMap, maintainer) => {
        const roleName = maintainer.role.name.toUpperCase().replaceAll(/\s/g, "_")

        if (roleName in maintainerMap) {
          return {
            ...maintainerMap,
            [roleName]: [...maintainerMap[roleName], maintainer],
          }
        }

        return {
          ...maintainerMap,
          [roleName]: [maintainer],
        }
      }, {} as Record<string, Maintainer[]>)
    : {}

  return {
    asset,
    responsibilities,
  }
}

type Props = {
  searchParams: Record<string, string | string[]>
  params: Record<string, string>
}

const AssetDetailView = async ({ searchParams, params }: Props) => {
  const tabQuery = searchParams.tab as string

  const session = await getSession(headers().get("cookie") ?? "")
  if (!session) return redirect("/auth/signing")

  const { asset, responsibilities } = await getAssetData(params.assetId)(session?.token ?? "")

  if (!asset) {
    return <div>Issues with fetching the asset - TODO figure out what to do here</div>
  }

  return (
    <main>
      <Container highlight>
        <AssetPageHeader communityName={asset.community.name} id={asset.id} name={asset.name} />
      </Container>
      <Container>
        <AssetPageTabs
          asset={asset}
          collibraBaseUrl={config.COLLIBRA_BASE_URL}
          responsibilities={responsibilities}
          tab={tabQuery}
        />
      </Container>
    </main>
  )
}

export default AssetDetailView
