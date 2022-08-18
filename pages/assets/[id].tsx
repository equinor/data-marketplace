/* eslint-disable camelcase */
import {
  Button, Divider, Icon, Typography, CircularProgress, Tabs,
} from "@equinor/eds-core-react"
import { shopping_cart_add } from "@equinor/eds-icons"
import type { GetServerSideProps } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useIntl, FormattedMessage } from "react-intl"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import {
  OverviewContent,
  ResponsibilitiesContent,
} from "../../components/AssetTabContent"
import { Container } from "../../components/Container"
import { useAssetData } from "../../hooks"
import { useAssetDetails } from "../../hooks/useAssetDetails"
import { Dispatch } from "../../store"

const {
  Tab: EdsTab, List, Panel, Panels,
} = Tabs

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1.5rem;
  align-items: baseline;
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
  assetId: string
}

const AssetDetailView = ({ assetId }: AssetDetailProps) => {
  const router = useRouter()
  const intl = useIntl()
  const dispatch = useDispatch<Dispatch>()

  const tabQuery = router.query.tab

  const { assetData, isLoading, error: assetDataError } = useAssetData(assetId)
  const {
    overviewData, responsibilitesData, isLoading: isLoadingDetails, error: assetDetailsError,
  } = useAssetDetails(assetId)

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
  }, [currentTab, router, assetId])

  const handleTabChange = (index: number) => {
    const newTab = tabs.find((tab) => tab.id === index)
    if (newTab && newTab.name !== currentTab.name) {
      setCurrentTab(newTab)
    }
  }

  const generalDocumentTitle = intl.formatMessage({ id: "common.documentTitle" })
  const handleAddToCart = () => {
    if (typeof assetId === "string") dispatch.checkout.addToCart(assetId)
  }

  if (assetDataError) {
    console.log(`[AssetDetailView] Failed while getting asset ${assetId}`, assetDataError)
  }
  if (assetDetailsError) {
    console.log(`[AssetDetailView] Failed while getting asset details ${assetId}`, assetDetailsError)
  }

  return (
    <main>
      <Head>
        <title>{assetData?.name ?? generalDocumentTitle}</title>
      </Head>

      <Container>
        <Header>
          {isLoading ? <CircularProgress />
            : assetData && (
              <>
                <Typography variant="h1_bold" as="h1">
                  {assetData.name}
                </Typography>

                <Button onClick={handleAddToCart}>
                  <Icon data={shopping_cart_add} />
                  <FormattedMessage id="asset.addToCart" />
                </Button>
              </>
            )}
        </Header>

        <Divider />
        <Tabs onChange={handleTabChange} activeTab={currentTab.id}>
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
              {isLoadingDetails ? <CircularProgress /> : <OverviewContent content={overviewData} />}
            </Panel>
            <Panel>
              {isLoadingDetails ? <CircularProgress />
                : <ResponsibilitiesContent content={responsibilitesData} />}
            </Panel>
          </Panels>
        </Tabs>
      </Container>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query
  // @TODO when we have server side token handle the case of no id or no data
  return { props: { assetId: id } }
}

export default AssetDetailView
