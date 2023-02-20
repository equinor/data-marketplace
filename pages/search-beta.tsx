// eslint-disable-next-line import/extensions
import { Typography, Divider } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { createInstantSearchNextRouter } from "instantsearch-router-next-experimental"
import type { NextPage, GetServerSideProps } from "next/types"
import { renderToString } from "react-dom/server"
import { getServerState } from "react-instantsearch-hooks-server"
import {
  Configure,
  InstantSearch,
  InstantSearchServerState,
  InstantSearchSSRProvider,
} from "react-instantsearch-hooks-web"
import { FormattedMessage, IntlProvider } from "react-intl"
import styled from "styled-components"

import { SearchBox, Hits, Hit, RefinementList, Pagination, CustomClearRefinement } from "components/ImprovedSearch"
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
    "pagination"
    "results";
  @media (min-width: 900px) {
    /* Temp. column width restriction until new page layout is ready */
    grid-template-columns: 17rem var(--huge-space) minmax(auto, 660px);
    grid-template-rows: min-content var(--huge-space) min-content;
    grid-template-areas:
      ". . search"
      ". . ."
      ". . totalResults"
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

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

// Because there so many thing going on without this
const onStateChange = (params: any) => {
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
        /* @ts-ignore */
        routing={{ router: createInstantSearchNextRouter({ serverUrl }) }}
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
            <Header>
              <Typography variant="h3" style={{ fontWeight: "26px" }}>
                <FormattedMessage id="improvedSearch.filter.header" />
              </Typography>
              <CustomClearRefinement />
            </Header>

            <Divider variant="small" />
            <RefinementList label="Data Office" attribute="community" />

            <RefinementList label="Provider" attribute="provider" />
            <RefinementList label="Owner" attribute="owner" />
            <RefinementList label="Technical steward" attribute="technicalSteward" />
            <RefinementList label="Data office admin" attribute="dataOfficeAdmin" />
            <RefinementList label="Data steward" attribute="dataSteward" />
          </FilterContainer>
          <PaginationContainer>
            <StyledPagination hitsPerPage={HITS_PER_PAGE} padding={1} />
          </PaginationContainer>
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
          <Typography variant="h1" style={{ textAlign: "center", marginBlock: tokens.spacings.comfortable.xxx_large }}>
            <FormattedMessage id="improvedSearch.header" />
          </Typography>
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
