/* eslint-disable camelcase */
import type { Asset, Maintainer } from "@equinor/data-marketplace-models"
import { Button, Icon, Typography, Tabs } from "@equinor/eds-core-react"
import { add } from "@equinor/eds-icons"
import axios from "axios"
import type { GetServerSideProps, NextPage } from "next"
import { getToken } from "next-auth/jwt"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled-components"

import { OverviewContent, ResponsibilitiesContent, ResponsibilitiesContentSections } from "components/AssetTabContent"
import { Page } from "components/Page"
import { Section } from "components/Section"
import { config } from "config"

const { Tab: EdsTab, List, Panel, Panels } = Tabs

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1.5rem;
  align-items: baseline;
`
const StyledTabs = styled(Tabs)`
  margin-top: 48px;
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
    <Page documentTitle={asset.name || undefined}>
      <main>
        <Section>
          <Header>
            <AssetHeading variant="h1">{asset.name}</AssetHeading>
            <NextLink
              href={{
                pathname: "/checkout/terms",
                query: { id: assetId },
              }}
              passHref
            >
              <Button as="span">
                <Icon data={add} />
                <FormattedMessage id="asset.getAccess" />
              </Button>
            </NextLink>
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
  const defaultPageProps = { asset: null }

  if (typeof id !== "string") {
    return {
      props: defaultPageProps,
    }
  }

  const token = await getToken({ req })

  if (!token || !token.accessToken || typeof token.accessToken !== "string") {
    return {
      props: defaultPageProps,
    }
  }

  try {
    // the adapter service has a bug where it sends two requests.
    // the first request goes through, while the second fails.
    // TODO: refactor services
    const { data: asset } = await axios.get<Asset>(`${config.ADAPTER_SERVICE_API_URL}/assets/${id}`, {
      headers: {
        authorization: `Bearer ${token.accessToken}`,
      },
      params: {
        code: config.ADAPTER_SERVICE_APP_KEY,
      },
    })

    const { data: maintainers } = await axios.get<Maintainer[]>(
      `${config.ADAPTER_SERVICE_API_URL}/assets/${id}/maintainers`,
      {
        headers: {
          authorization: `Bearer ${token.accessToken}`,
        },
        params: {
          code: config.ADAPTER_SERVICE_APP_KEY,
        },
      }
    )

    return {
      props: {
        asset,
        collibraBaseUrl: process.env.COLLIBRA_BASE_URL || "",
        responsibilitiesData: Array.isArray(maintainers)
          ? maintainers.reduce((map, maintainer) => {
              const key = maintainer.role.name.toUpperCase().replaceAll(/\s/g, "_")

              if (key in map) {
                return {
                  ...map,
                  [key]: [...map[key], maintainer],
                }
              }

              return {
                ...map,
                [key]: [maintainer],
              }
            }, {} as Record<string, Maintainer[]>)
          : {},
      },
    }
  } catch (error) {
    console.error(`[AssetDetailView] in getServerSideProps - Failed getting asset details for asset ${id}`, error)

    return { props: defaultPageProps }
  }
}

export default AssetDetailView
