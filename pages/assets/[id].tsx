/* eslint-disable camelcase */
import {
  Button, Icon, Typography, Tabs,
} from "@equinor/eds-core-react"
import { shopping_cart_add } from "@equinor/eds-icons"
import type { GetServerSideProps, NextPage } from "next"
import { getToken } from "next-auth/jwt"
import NextLink from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled-components"

import {
  OverviewContent,
  ResponsibilitiesContent,
  ResponsibilitiesContentSections,
} from "components/AssetTabContent"
import { Page } from "components/Page"
import { Section } from "components/Section"
import { CollibraService } from "services/CollibraService"

const {
  Tab: EdsTab, List, Panel, Panels,
} = Tabs

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
  id: number,
  name: TabName;
}

const getTabs = (): Tab[] => ([
  {
    id: 0,
    name: "overview",
  },
  {
    id: 1,
    name: "responsibilities",
  },
])

const getInitialTab = (tabs: Tab[], tabQuery: string | undefined | string[]) => {
  const tabName = typeof tabQuery === "string" ? tabQuery : "overview"
  const tabData = tabs.find((tab) => tab.name === tabName)
  // Some evil user might do crazy stuff like manually editing the tab query param
  return tabData || tabs[0]
}

type AssetDetailProps = {
  asset?: DataMarketplace.Asset | null,
  responsibilitiesData?: ResponsibilitiesContentSections
}

const AssetDetailView: NextPage<AssetDetailProps> = ({ asset, responsibilitiesData }) => {
  const router = useRouter()
  const intl = useIntl()

  const tabQuery = router.query.tab
  const tabs = getTabs()
  const [currentTab, setCurrentTab] = useState<Tab>(getInitialTab(tabs, tabQuery))

  useEffect(() => {
    const { tab } = router.query
    if (!(tab === currentTab.name)) {
      router.replace(
        { query: { ...router.query, tab: currentTab.name } },
        { query: { tab: currentTab.name } },
        { shallow: true },
      )
    }
  }, [currentTab, router])

  if (!asset) {
    return (
      <div>
        Banner - issues with fetching the asset - TODO figure out what to do here
      </div>
    )
  }

  const { id: assetId } = asset

  const handleTabChange = (index: number) => {
    const newTab = tabs.find((tab) => tab.id === index)
    if (newTab && newTab.name !== currentTab.name) {
      setCurrentTab(newTab)
    }
  }

  return (
    <Page documentTitle={asset.name || undefined}>
      <main>
        <Section>
          <Header>
            <AssetHeading variant="h1">
              {asset.name}
            </AssetHeading>
            <NextLink
              href={{
                pathname: "/checkout/terms",
                query: { id: assetId },
              }}
              passHref
            >
              <Button as="a">
                <Icon data={shopping_cart_add} />
                <FormattedMessage id="asset.getAccess" />
              </Button>
            </NextLink>
          </Header>

          <StyledTabs onChange={handleTabChange} activeTab={currentTab.id}>
            <List>
              <EdsTab key="overview">
                {intl.formatMessage({ id: "asset.overview" })}
              </EdsTab>
              <EdsTab key="responsibilities">
                {intl.formatMessage({ id: "asset.responsibilites" })}
              </EdsTab>
            </List>
            <Panels>
              <Panel>
                <OverviewContent
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

  const collibraService = new CollibraService(token.accessToken as string)

  try {
    const asset = await collibraService.getAssetWithAttributes(id as string)

    let responsibilities = await collibraService.getAssetResponsibilities(id as string)

    if (!responsibilities) {
      console.warn("[AssetDetailView] No responsibilites found for", id)
    }

    // filter out results that are not a "User" type
    responsibilities = responsibilities.filter((responsibility) => (
      responsibility.owner.type === "User"
    ))

    const users = await Promise.all(responsibilities.map((responsibility) => (
      collibraService.getUser(responsibility.owner.id)
    )))

    const responsibilitiesData: ResponsibilitiesContentSections = responsibilities
      .reduce((data, responsibility) => {
        const user = users.find((u) => u.id === responsibility.owner.id)
        if (!user) return data

        const responsibilityName = responsibility.name.toUpperCase().replace(/\s/g, "_")

        return {
          ...data,
          [responsibilityName]: [
            ...(data[responsibilityName] ?? []),
            user,
          ],
        }
      }, {} as ResponsibilitiesContentSections)

    return {
      props: {
        asset: JSON.parse(JSON.stringify(asset)),
        responsibilitiesData: JSON.parse(JSON.stringify(responsibilitiesData)),
      },
    }
  } catch (error) {
    console.error(`[AssetDetailView] in getServerSideProps - Failed getting asset details for asset ${id}`, error)

    return { props: defaultPageProps }
  }
}

export default AssetDetailView
