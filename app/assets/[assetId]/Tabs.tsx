"use client"

import { Asset, Maintainer } from "@equinor/data-marketplace-models"
import { Tabs } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FunctionComponent, useState } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { OverviewContent, ResponsibilitiesContent } from "components/AssetTabContent"

const { Tab: EdsTab, List, Panel: EdsPanel, Panels } = Tabs

const Panel = styled(EdsPanel)`
  padding: ${tokens.spacings.comfortable.large} 0;
`

type TabName = "overview" | "responsibilities"

export type Tab = {
  id: number
  name: TabName
}

const getTabs = (): Tab[] => [
  {
    id: 0,
    name: "overview",
  },
  {
    id: 1,
    name: "responsibilities",
  },
]

const getInitialTab = (tabs: Tab[], tabQuery: string | undefined | string[]) => {
  const tabName = typeof tabQuery === "string" ? tabQuery : "overview"
  const tabData = tabs.find((tab) => tab.name === tabName)
  // Some evil user might do crazy stuff like manually editing the tab query param
  return tabData || tabs[0]
}

type Props = {
  asset: Asset
  collibraBaseUrl: string
  responsibilities: Record<string, Maintainer[]>
  tab: string
}

export const AssetPageTabs: FunctionComponent<Props> = ({ asset, collibraBaseUrl, responsibilities, tab }) => {
  const tabs = getTabs()
  const [currentTab, setCurrentTab] = useState<Tab>(getInitialTab(tabs, tab))
  const pathname = usePathname()
  const query = useSearchParams()
  const router = useRouter()
  const intl = useIntl()

  const handleTabChange = (index: number) => {
    const newTab = tabs.find((t) => t.id === index)

    if (newTab && newTab.name !== currentTab.name) {
      setCurrentTab(newTab)

      const params = new URLSearchParams()

      if (query) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of query) {
          params.append(key, value)
        }
      }
      params.set("tab", newTab.name)
      router.replace(new URL(`${pathname ?? ""}?${params.toString()}`, window.location.origin).toString())
    }
  }

  return (
    <Tabs onChange={handleTabChange} activeTab={currentTab.id}>
      <List>
        <EdsTab key="overview">{intl.formatMessage({ id: "asset.overview" })}</EdsTab>
        <EdsTab key="responsibilities">{intl.formatMessage({ id: "asset.responsibilites" })}</EdsTab>
      </List>
      <Panels>
        <Panel>
          <OverviewContent
            assetId={asset.id}
            collibraBaseUrl={collibraBaseUrl}
            content={{
              description: asset.description,
              updateFrequency: asset.updateFrequency,
              excerpt: asset.excerpt,
            }}
          />
        </Panel>
        <Panel>
          <ResponsibilitiesContent content={responsibilities} />
        </Panel>
      </Panels>
    </Tabs>
  )
}
