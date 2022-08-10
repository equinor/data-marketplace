/* eslint-disable camelcase */
import {
  Button, Divider, Icon, Typography, CircularProgress,
} from "@equinor/eds-core-react"
import { shopping_cart_add } from "@equinor/eds-icons"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter, NextRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import { useIntl, FormattedMessage, IntlShape } from "react-intl"
import { useDispatch } from "react-redux"
import styled from "styled-components"

import { AssetTabContent } from "../../components/AssetTabContent"
import { AssetTabs } from "../../components/AssetTabContent/types"
import { Container } from "../../components/Container"
import { useAssetData } from "../../hooks"
import { HttpClient } from "../../lib/HttpClient"
import { Dispatch } from "../../store"

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1.5rem;
  align-items: baseline;
`

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: minmax(10rem, 13rem) 1fr;
  grid-gap: 1.5rem;
`

const TabNavContainer = styled.aside`
  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      position: relative;
      left: -0.75rem;
    }
  }
`

const TabLink = styled(Button)`
  display: inline-block;

`

type Tab = {
  getDataSrc: (assetID: string) => string;
  hash: string;
  key: string;
  label: string;
}

const getTabs = (intl: IntlShape) => ([
  {
    getDataSrc: (assetID: string) => `/api/assets/${assetID}/overview`,
    hash: "#overview",
    key: "overview",
    label: intl.formatMessage({ id: "asset.overview" }),
  },
  {
    getDataSrc: (assetID: string) => `/api/assets/${assetID}/responsibilities`,
    hash: "#responsibilities",
    key: "responsibilities",
    label: intl.formatMessage({ id: "asset.responsibilites" }),
  },
])

const getInitialTab = (tabs: Tab[], router: NextRouter) => {
  const initialTab = router.asPath.split("#")[1] || "overview"
  const tabData = tabs.find((tab) => tab.key === initialTab)
  // Because find can in theory return undefined, so an additional ts guard here :/
  // @TODO Better solution
  return tabData || tabs[0]
}

const AssetDetailView: NextPage = () => {
  const router = useRouter()
  const intl = useIntl()
  const dispatch = useDispatch<Dispatch>()
  const { assetData, isLoading } = useAssetData(router.query.id)
  const tabs = getTabs(intl)

  const [currentTab, setCurrentTab] = useState<Tab>(getInitialTab(tabs, router))
  const [tabData, setTabData] = useState<any>()

  const assetId = router.query.id || ""

  useEffect(() => {
    const urlHash = router.asPath.split("#")[1]
    const { tab } = router.query

    if (!(urlHash === currentTab.key || tab === currentTab.key)) {
      if (router.isReady) {
        router.replace(
          { query: { ...router.query, tab: currentTab.key } },
          { query: { tab: currentTab.key } },
          { shallow: true },
        )
      }
    }
  }, [currentTab, router])

  useEffect(() => {
    let ignore = false

    const { tab } = router.query
    if (currentTab && router.query.id && tab === currentTab.key) {
      (async () => {
        try {
          const res = await HttpClient.get(currentTab.getDataSrc(router.query.id as string), {
            headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
          })
          if (!ignore) {
            setTabData(res.body)
          }
        } catch (error) {
          console.error("[AssetDetailView] Failed while getting asset", router.query.id)
        }
      })()
    }
    return () => {
      ignore = true
    }
  }, [currentTab, router])

  const handleTabChange = (key: string) => {
    const newTab = tabs.find((tab) => tab.key === key)

    if (newTab && newTab.key !== currentTab.key) {
      setCurrentTab(newTab)
    }
  }

  const mapTabKeyToEnum = useCallback((tab: string) => ({
    overview: AssetTabs.Overview,
    responsibilities: AssetTabs.Responsibilities,
  })[tab], [])

  const generalDocumentTitle = intl.formatMessage({ id: "common.documentTitle" })
  const handleAddToCart = () => {
    dispatch.checkout.addToCart(assetId as string)
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

        <ContentContainer>
          <TabNavContainer>
            <nav>
              <ul>
                {tabs.map((tab) => (
                  <li key={tab.key}>

                    <TabLink
                      type="button"
                      onClick={() => handleTabChange(tab.key)}
                      variant={currentTab?.hash === tab.hash ? "contained" : "outlined"}
                    >
                      {tab.label}
                    </TabLink>

                  </li>
                ))}
              </ul>
            </nav>
          </TabNavContainer>

          <AssetTabContent tab={mapTabKeyToEnum(currentTab?.key!)!} data={tabData} />
        </ContentContainer>
      </Container>
    </main>
  )
}

export default AssetDetailView
