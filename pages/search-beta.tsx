// eslint-disable-next-line import/extensions
// import { history } from "instantsearch.js/es/lib/routers/index.js"
import type { NextPage, GetServerSideProps } from "next/types"
// import Router, { useRouter } from "next/router"
import { useRef } from "react"
import { renderToString } from "react-dom/server"
import { getServerState } from "react-instantsearch-hooks-server"
import {
  Configure,
  InstantSearch,
  InstantSearchServerState,
  InstantSearchSSRProvider,
} from "react-instantsearch-hooks-web"
import { IntlProvider } from "react-intl"
import styled from "styled-components"

import { SearchBox, Hits, Hit, algoliaNextJsHistoryRouter } from "components/ImprovedSearch"
import { Page } from "components/Page"
import { Section } from "components/Section"
import { searchClient, searchClientServer } from "config"
import englishTexts from "locales/english.json"

const StyledHits = styled(Hits)`
  /* Temporary styles */
  & .ais-Hits-list {
    list-style-type: none;
  }

  & .ais-Hits-item {
    margin-block: 1rem;
  }
`

const Filters = styled.div``

const SearchContainer = styled.div`
  display: grid;
  @media (min-width: 700px) {
    grid-template-columns: 10rem 1fr;
  }
`

type Props = {
  serverState?: InstantSearchServerState
  serverUrl?: URL | string
  isServerRendered: boolean
  routingRef?: any
  featureFlags?: {
    USE_IMPROVED_SEARCH: "true" | "false"
  }
}

/* const onStateChange = async (params: any) => {
  if (Object.keys(params.uiState.instant_search).length > 0 && Router.pathname !== "/search") {
    await Router.push("/search", undefined, { shallow: true })
  }

  params.setUiState(params.uiState)
}
 */
const routing = (requestUrl: string) => ({
  router: algoliaNextJsHistoryRouter({
    getLocation() {
      if (typeof window === "undefined") {
        const url = new URL(requestUrl)
        return url
      }

      return window.location as any
    },
  }),
})

const Search = ({ serverState, isServerRendered, /* serverUrl, */ routingRef }: Props) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <InstantSearchSSRProvider {...serverState}>
    <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
      <InstantSearch
        searchClient={isServerRendered ? searchClientServer : searchClient}
        indexName="Data_Set"
        /*  routing={{
          router: history({
            getLocation() {
              if (typeof window === "undefined") {
                return new URL(serverUrl!) as unknown as Location
              }
              return window.location
            },
          }),
        }} */
        /*  onStateChange={onStateChange} */
        routing={routingRef}
      >
        <Configure hitsPerPage={50} snippetEllipsisText="..." attributesToSnippet={["excerpt", "description"]} />
        <SearchBox />
        {/* @ts-ignore  */}
        <StyledHits hitComponent={Hit} />
      </InstantSearch>
    </IntlProvider>
  </InstantSearchSSRProvider>
)

const SearchPage: NextPage<Props> = ({
  serverState,
  isServerRendered = false,
  serverUrl,
  featureFlags = { USE_IMPROVED_SEARCH: "false" },
}) => {
  const { USE_IMPROVED_SEARCH } = featureFlags
  const routingRef = useRef(routing(serverUrl as string))

  return (
    <Page documentTitle="Beta for new and improved search" useImprovedSearch={USE_IMPROVED_SEARCH}>
      <main>
        <Section>
          <Filters />
          <h1>Beta version for improved search</h1>
          <SearchContainer>
            <Filters>Filters</Filters>
            <div>
              <Search
                routingRef={routingRef.current}
                serverState={serverState}
                isServerRendered={isServerRendered}
                serverUrl={serverUrl}
              />
            </div>
          </SearchContainer>
        </Section>
      </main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const protocol = req.headers.referer?.split("://")[0] || "https"
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`
  const serverState = await getServerState(<Search serverUrl={serverUrl} isServerRendered />, {
    renderToString,
  })
  const { USE_IMPROVED_SEARCH } = process.env
  return {
    props: {
      serverState,
      serverUrl,
      featureFlags: {
        USE_IMPROVED_SEARCH,
      },
    },
  }
}

export default SearchPage
