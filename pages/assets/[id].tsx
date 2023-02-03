/* eslint-disable camelcase */
import type { Asset, Maintainer } from "@equinor/data-marketplace-models"
import { Button, Icon, Typography, Tabs } from "@equinor/eds-core-react"
import { add } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { GetServerSideProps, NextPage } from "next"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled-components"

import { OverviewContent, ResponsibilitiesContent, ResponsibilitiesContentSections } from "components/AssetTabContent"
import { Page } from "components/Page"
import { Section } from "components/Section"
import { config } from "config"
import { request } from "lib/net/request"

const { Tab: EdsTab, List, Panel: EdsPanel, Panels } = Tabs

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1.5rem;
  align-items: baseline;
`

const StyledTabs = styled(Tabs)`
  margin-top: 48px;
`

const Panel = styled(EdsPanel)`
  padding: ${tokens.spacings.comfortable.large} 0;
`

const AssetHeading = styled(Typography)`
  font-size: 2.5rem;
`

type TabName = "overview" | "responsibilities"

type Tab = {
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

type AssetDetailProps = {
  asset?: Asset | null
  responsibilitiesData?: ResponsibilitiesContentSections
  collibraBaseUrl: string
  featureFlags?: {
    USE_IMPROVED_SEARCH: "true" | "false"
  }
}

const AssetDetailView: NextPage<AssetDetailProps> = ({
  asset,
  responsibilitiesData,
  collibraBaseUrl,
  featureFlags = { USE_IMPROVED_SEARCH: "false" },
}) => {
  const { USE_IMPROVED_SEARCH } = featureFlags
  const router = useRouter()
  const intl = useIntl()

  const tabQuery = router.query.tab
  const tabs = getTabs()
  const [currentTab, setCurrentTab] = useState<Tab>(getInitialTab(tabs, tabQuery))

  if (!asset) {
    return <div>Issues with fetching the asset - TODO figure out what to do here</div>
  }

  const { id: assetId } = asset

  const handleTabChange = (index: number) => {
    const newTab = tabs.find((tab) => tab.id === index)

    if (newTab && newTab.name !== currentTab.name) {
      setCurrentTab(newTab)
      router.replace(
        { query: { ...router.query, tab: newTab.name } },
        { query: { tab: newTab.name } },
        { shallow: true }
      )
    }
  }

  return (
    <Page
      documentTitle={asset.name || intl.formatMessage({ id: "common.documentTitle" })}
      useImprovedSearch={USE_IMPROVED_SEARCH}
    >
      <main>
        <Section>
          <Header>
            <AssetHeading variant="h1">{asset.name}</AssetHeading>
            <Button
              as={NextLink}
              /*  Because EDS types href as string */
              /* @ts-ignore */
              href={{
                pathname: "/checkout/terms",
                query: { id: assetId },
              }}
            >
              <Icon data={add} />
              <FormattedMessage id="asset.getAccess" />
            </Button>
          </Header>

          <StyledTabs onChange={handleTabChange} activeTab={currentTab.id}>
            <List>
              <EdsTab key="overview">{intl.formatMessage({ id: "asset.overview" })}</EdsTab>
              <EdsTab key="responsibilities">{intl.formatMessage({ id: "asset.responsibilites" })}</EdsTab>
            </List>
            <Panels>
              <Panel>
                <OverviewContent
                  assetId={assetId}
                  collibraBaseUrl={collibraBaseUrl}
                  content={{
                    description: asset.description,
                    updateFrequency: asset.updateFrequency,
                    excerpt: asset.excerpt,
                  }}
                />
              </Panel>
              <Panel>
                <ResponsibilitiesContent content={responsibilitiesData} />
              </Panel>
            </Panels>
          </StyledTabs>
        </Section>
      </main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id } = query
  const { USE_IMPROVED_SEARCH = "false" } = process.env
  const defaultPageProps = {
    asset: null,
    featureFlags: {
      USE_IMPROVED_SEARCH,
    },
  }

  if (typeof id !== "string") {
    return {
      props: defaultPageProps,
    }
  }

  try {
    // the HttpClient class seems to have a bug where it sends two requests.
    // the first request goes through, while the second fails.
    // this has not been observed with other requests (although it hasn't been thoroughly investigated).
    // TODO: refactor services
    const assetRes = await request(
      `${config.ADAPTER_SERVICE_API_URL}/assets/${id}?code=${config.ADAPTER_SERVICE_APP_KEY}`,
      { retries: 3 }
    )({ req })
    const asset: Asset = await assetRes.json()

    const maintainersRes = await request(
      `${config.ADAPTER_SERVICE_API_URL}/assets/${id}/maintainers?code=${config.ADAPTER_SERVICE_APP_KEY}`,
      { retries: 3 }
    )({ req })
    const maintainers: Maintainer[] = await maintainersRes.json()

    const responsibilitiesData = Array.isArray(maintainers)
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
      props: {
        asset,
        collibraBaseUrl: process.env.COLLIBRA_BASE_URL || "",
        responsibilitiesData,
        featureFlags: {
          USE_IMPROVED_SEARCH,
        },
      },
    }
  } catch (error) {
    /* eslint-disable no-console */
    console.error(`[AssetDetailView] in getServerSideProps - Failed getting asset details for asset ${id}`, error)

    return { props: defaultPageProps }
  }
}

export default AssetDetailView
