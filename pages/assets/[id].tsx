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

import { AssetTabContent } from "../../components/AssetTabContent"
import { Container } from "../../components/Container"
import { useAssetData } from "../../hooks"
import { HttpClient } from "../../lib/HttpClient"
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

type Tab = {
  getDataSrc: (assetID: string) => string;
  hash: string;
  key: string;
}

const getTabs = () => ([
  {
    getDataSrc: (assetID: string) => `/api/assets/${assetID}/overview`,
    hash: "#overview",
    key: "overview",
  },
  {
    getDataSrc: (assetID: string) => `/api/assets/${assetID}/responsibilities`,
    hash: "#responsibilities",
    key: "responsibilities",
  },
])

const getInitialTab = (tabs: Tab[], tabQuery: string | undefined | string[]) => {
  const tabName = typeof tabQuery === "string" ? tabQuery : "overview"
  const tabData = tabs.find((tab) => tab.key === tabName)
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

  // const assetId = router.query.id
  const tabQuery = router.query.tab

  const { assetData, isLoading, error: assetDataError } = useAssetData(assetId)
  const tabs = getTabs()

  const [currentTab, setCurrentTab] = useState<Tab>(getInitialTab(tabs, tabQuery))
  const [tabData, setTabData] = useState<any>()
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const { tab } = router.query
    if (!(tab === currentTab.key)) {
      router.replace(
        { query: { ...router.query, tab: currentTab.key } },
        { query: { tab: currentTab.key } },
        { shallow: true },
      )
    }
  }, [currentTab, router, assetId])

  useEffect(() => {
    let ignore = false

    const { tab } = router.query
    if (currentTab && typeof assetId === "string" && tab === currentTab.key) {
      (async () => {
        try {
          const res = await HttpClient.get(currentTab.getDataSrc(assetId), {
            headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
          })
          if (!ignore) {
            setTabData(res.body)
          }
        } catch (err) {
          console.error("[AssetDetailView] Failed while getting asset", assetId)
        }
      })()
    }
    return () => {
      ignore = true
    }
  }, [currentTab, router, assetId])

  const handleTabChange = (index: number) => {
    console.log(index)
    // @TODO This is just a temp hack
    let key = ""
    if (index === 0) key = "overview"
    else key = "responsibilities"

    const newTab = tabs.find((tab) => tab.key === key)
    console.log(newTab)
    if (newTab && newTab.key !== currentTab.key) {
      setCurrentTab(newTab)
      setActiveTab(index)
    }
  }

  /*  const mapTabKeyToEnum = useCallback((tab: string) => ({
    overview: AssetTabs.Overview,
    responsibilities: AssetTabs.Responsibilities,
  })[tab], []) */

  const generalDocumentTitle = intl.formatMessage({ id: "common.documentTitle" })
  const handleAddToCart = () => {
    if (typeof assetId === "string") dispatch.checkout.addToCart(assetId)
  }

  if (assetDataError) {
    console.log(`[AssetDetailView] Failed while getting asset ${assetId}`, assetDataError)
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
        <Tabs onChange={handleTabChange} activeTab={activeTab}>
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
              <AssetTabContent tab={0} data={tabData} />
            </Panel>
            <Panel>
              <AssetTabContent tab={1} data={tabData} />
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
