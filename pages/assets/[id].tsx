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
import { config } from "config"
import { HttpClient } from "lib/HttpClient"
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

  if (!token) {
    return {
      props: defaultPageProps,
    }
  }

  const authorization = `Bearer ${token.accessToken}`

  const collibraService = new CollibraService(token!.accessToken as string)

  try {
    const asset = await collibraService.getAssetWithAttributes(id as string)

    const { body: responsibilities } = await HttpClient.get<Collibra.PagedResponsibilityResponse>(`${config.COLLIBRA_BASE_URL}/responsibilities`, {
      headers: { authorization },
      query: { resourceIds: id },
    })

    if (!responsibilities) {
      console.warn("[AssetDetailView] No responsibilites found for", id)
    }

    // filter out results that are not a "Role" and "User" type
    const usersWithRoles = (responsibilities && responsibilities.results.filter((result: any) => (
      result.role.resourceType === "Role"
        && result.owner.resourceType === "User"
    )).map((responsibility: any) => ({
      role: responsibility.role.name.toUpperCase().replace(/\s/g, "_"),
      id: responsibility.owner.id,
    }))) || []

    const usersRes = await Promise.all(usersWithRoles.map((user: any) => HttpClient.get<Collibra.User>(`${config.COLLIBRA_BASE_URL}/users/${user.id}`, {
      headers: { authorization },
    })))

    const users = usersWithRoles.reduce((obj, user) => {
      const collibraUser = usersRes.find((r) => r.body?.id === user.id)?.body

      if (!collibraUser) return obj

      const transformedUser = {
        ...user,
        firstName: collibraUser.firstName || null,
        lastName: collibraUser.lastName || null,
        email: collibraUser.emailAddress || null,
      }

      if (user.role in obj) {
        return {
          ...obj,
          [user.role]: [
            ...obj[user.role],
            transformedUser,
          ],
        }
      }

      return {
        ...obj,
        [user.role]: [transformedUser],
      }
    }, {} as Record<string, any[]>)

    return {
      props: {
        asset: JSON.parse(JSON.stringify(asset)),
        responsibilitiesData: users,
      },
    }
  } catch (error) {
    console.error(`[AssetDetailView] in getServerSideProps - Failed getting asset details for asset ${id}`, error)

    return { props: defaultPageProps }
  }
}

export default AssetDetailView
