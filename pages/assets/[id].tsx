/* eslint-disable camelcase */
import type { Asset, Maintainer } from "@equinor/data-marketplace-models"
import { Button, Icon, Tabs, Typography } from "@equinor/eds-core-react"
import { key } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { GetServerSideProps, NextPage } from "next"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled-components"

import { OverviewContent, ResponsibilitiesContent, ResponsibilitiesContentSections } from "components/AssetTabContent"
import { Container } from "components/Container"
import { Page } from "components/Page"
import { Heading } from "components/Typography"
import { config } from "config"
import { request } from "lib/net/request"

const { Tab: EdsTab, List, Panel: EdsPanel, Panels } = Tabs

const Header = styled.header`
  @media (min-width: 850px) {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-gap: 1.5rem;
    align-items: end;
  }
`

const AssetHeading = styled.div`
  margin-bottom: var(--space-32);
  @media (min-width: 850px) {
    margin-bottom: 0;
  }
`

const Panel = styled(EdsPanel)`
  padding: ${tokens.spacings.comfortable.large} 0;
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
}

const AssetDetailView: NextPage<AssetDetailProps> = ({ asset, responsibilitiesData, collibraBaseUrl }) => {
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
    <Page documentTitle={asset.name || intl.formatMessage({ id: "common.documentTitle" })}>
      <main>
        <Container highlight>
          <Header>
            <AssetHeading>
              {asset.community && (
                <Typography variant="overline" as="span" style={{ fontSize: "var(--text-xs)" }}>
                  {asset.community.name}
                </Typography>
              )}
              <Heading level="h1" size="2xl">
                {asset.name}
              </Heading>
            </AssetHeading>
            <Button
              as={NextLink}
              /*  Because EDS types href as string */
              /* @ts-ignore */
              href={{
                pathname: "/checkout/terms/page.tsx",
                query: { id: assetId },
              }}
            >
              <Icon data={key} />
              <FormattedMessage id="asset.getAccess" />
            </Button>
          </Header>
        </Container>
        <Container>
          <Tabs onChange={handleTabChange} activeTab={currentTab.id}>
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
          </Tabs>
        </Container>
      </main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id } = query
  const defaultPageProps = {
    asset: null,
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
      `${config.ADAPTER_SERVICE_API_URL}/assets/${id}/maintainers?code=${config.ADAPTER_SERVICE_APP_KEY}&group=Data Steward,Technical Steward`,
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
      },
    }
  } catch (error) {
    /* eslint-disable no-console */
    console.error(`[AssetDetailView] in getServerSideProps - Failed getting asset details for asset ${id}`, error)

    return { props: defaultPageProps }
  }
}

export default AssetDetailView
