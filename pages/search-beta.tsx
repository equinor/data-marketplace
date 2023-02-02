// eslint-disable-next-line import/extensions
import { tokens } from "@equinor/eds-tokens"
import type { NextPage, GetServerSideProps } from "next/types"
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

import { SearchBox, Hits, Hit, RefinementList, algoliaNextJsHistoryRouter, Pagination } from "components/ImprovedSearch"
import { Page } from "components/Page"
import { Section } from "components/Section"
import { searchClient, searchClientServer } from "config"
import englishTexts from "locales/english.json"

const SearchContainer = styled.div`
  display: grid;
  grid-template-areas:
    "search"
    "filter"
    "results"
    "pagination";
  @media (min-width: 900px) {
    grid-template-columns: auto calc(2 * ${tokens.spacings.comfortable.xxx_large}) 1fr;
    grid-template-rows: min-content calc(2 * ${tokens.spacings.comfortable.xxx_large}) min-content;
    grid-template-areas:
      ". . search"
      ". . ."
      "filter .  results"
      ". . pagination";
  }
`
const StyledPagination = styled(Pagination)`
  justify-content: center;
`

const StyledSearchBox = styled.div`
  grid-area: search;
`

const FilterContainer = styled.div`
  grid-area: filter;
`

const PaginationContainer = styled.div`
  grid-area: pagination;
`

const StyledHits = styled.div`
  grid-area: results;
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

const Search = ({ serverState, isServerRendered, serverUrl }: Props) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <InstantSearchSSRProvider {...serverState}>
    <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
      <InstantSearch
        searchClient={isServerRendered ? searchClientServer : searchClient}
        indexName="Data_Set"
        routing={{
          router: algoliaNextJsHistoryRouter({
            getLocation() {
              if (typeof window === "undefined") {
                return new URL(serverUrl!) as unknown as Location
              }
              return window.location
            },
          }),
        }}
      >
        <Configure hitsPerPage={10} snippetEllipsisText="..." attributesToSnippet={["excerpt:35", "description:15"]} />

        <SearchContainer>
          <StyledSearchBox>
            <SearchBox />
          </StyledSearchBox>
          <FilterContainer>
            <RefinementList attribute="community" />
          </FilterContainer>

          <StyledHits>
            {/* @ts-ignore  */}
            <Hits hitComponent={Hit} />
          </StyledHits>
        </SearchContainer>
        <PaginationContainer>
          <StyledPagination hitsPerPage={10} />
        </PaginationContainer>
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

  return (
    <Page documentTitle="Beta for new and improved search" useImprovedSearch={USE_IMPROVED_SEARCH}>
      <main>
        <Section>
          <h1>Beta version for improved search</h1>
          <Search serverState={serverState} isServerRendered={isServerRendered} serverUrl={serverUrl} />
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

  const { USE_IMPROVED_SEARCH = "false" } = process.env
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
