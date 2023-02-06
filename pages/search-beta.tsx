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
  SearchBox,
} from "react-instantsearch-hooks-web"
import { IntlProvider } from "react-intl"
import styled from "styled-components"

import { Hits, Hit, RefinementList, algoliaNextJsHistoryRouter, PlainRefinementList } from "components/ImprovedSearch"
import { Page } from "components/Page"
import { SearchStatistics } from "components/SearchStatistics"
import { Section } from "components/Section"
import { searchClient, searchClientServer } from "config"
import englishTexts from "locales/english.json"

const SearchContainer = styled.div`
  --huge-space: calc(2 * ${tokens.spacings.comfortable.xxx_large});
  display: grid;
  grid-template-areas:
    "search"
    "filter"
    "totalResults"
    "results";
  @media (min-width: 900px) {
    grid-template-columns: 17rem var(--huge-space) 1fr;
    grid-template-rows: min-content var(--huge-space) min-content;
    grid-template-areas:
      ". . search"
      ". . ."
      ". . totalResults"
      "filter .  results";
  }
`
const StyledSearchBox = styled.div`
  grid-area: search;
`

const FilterContainer = styled.div`
  grid-area: filter;
`

const StyledHits = styled.div`
  grid-area: results;
`

const TotalResults = styled.div`
  margin-block: ${tokens.spacings.comfortable.medium};
  grid-area: totalResults;
`

type Props = {
  serverState?: InstantSearchServerState
  serverUrl?: URL | string
  isServerRendered: boolean
  routingRef?: any
  featureFlags?: {
    USE_IMPROVED_SEARCH: boolean
  }
}

const HITS_PER_PAGE = 10

const onStateChange = async (params: any) => {
  console.log("Query", params.uiState.Data_Set?.query)

  params.setUiState(params.uiState)
}

const Search = ({ serverState, isServerRendered, serverUrl }: Props) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <InstantSearchSSRProvider {...serverState}>
    <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
      <InstantSearch
        searchClient={isServerRendered ? searchClientServer : searchClient}
        indexName="Data_Set"
        onStateChange={onStateChange}
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
        <Configure
          hitsPerPage={HITS_PER_PAGE}
          snippetEllipsisText="..."
          attributesToSnippet={["excerpt:30", "description:30"]}
        />

        <SearchContainer>
          <StyledSearchBox>
            <SearchBox />
          </StyledSearchBox>
          <TotalResults>
            <SearchStatistics hitsPerPage={HITS_PER_PAGE} />
          </TotalResults>
          <StyledHits>
            {/* @ts-ignore  */}
            <Hits hitComponent={Hit} />
          </StyledHits>
          <FilterContainer>
            <RefinementList attribute="community" />
            <PlainRefinementList label="Provider" attribute="provider" />
            <PlainRefinementList label="Owner" attribute="owner" />
            <PlainRefinementList label="Technical steward" attribute="technicalSteward" />
            <PlainRefinementList label="Data office admin" attribute="dataOfficeAdmin" />
            <PlainRefinementList label="Data steward" attribute="dataSteward" />
          </FilterContainer>
        </SearchContainer>
      </InstantSearch>
    </IntlProvider>
  </InstantSearchSSRProvider>
)

const SearchPage: NextPage<Props> = ({
  serverState,
  isServerRendered = false,
  serverUrl,
  featureFlags = { USE_IMPROVED_SEARCH: false },
}) => {
  const { USE_IMPROVED_SEARCH } = featureFlags

  return (
    <Page documentTitle="Beta for new and improved search" useImprovedSearch={USE_IMPROVED_SEARCH}>
      <main>
        <Section highlight>
          <h1>Beta version for improved search</h1>
          <Search serverState={serverState} isServerRendered={isServerRendered} serverUrl={serverUrl} />
        </Section>
      </main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const USE_IMPROVED_SEARCH = process.env.USE_IMPROVED_SEARCH === "true"

  if (!USE_IMPROVED_SEARCH) {
    return {
      notFound: true,
    }
  }

  const protocol = req.headers.referer?.split("://")[0] || "https"
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`

  const serverState = await getServerState(<Search serverUrl={serverUrl} isServerRendered />, {
    renderToString,
  })

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
