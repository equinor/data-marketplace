// eslint-disable-next-line import/extensions
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
import { FormattedMessage, useIntl, IntlProvider } from "react-intl"
import styled from "styled-components"

import { Container } from "components/Container"
import { Page } from "components/Page"
import {
  SearchBox,
  Hits,
  Hit,
  RefinementList,
  Pagination,
  CustomClearRefinement,
  SearchStatistics,
} from "components/Search"
import { Heading } from "components/Typography"
import { searchClient, searchClientServer } from "config"
import englishTexts from "locales/english.json"

const SearchContainer = styled.div`
  --huge-space: calc(2 * ${tokens.spacings.comfortable.xxx_large});
  /* Lot's of different text sizes going on here, I expect this to change
  at some point. But add an explicit height for now and reuse as line height for 
  the stats header to get proper alignment */
  --baseline-text-height: 2.25rem;
  display: grid;
  grid-template-areas:
    "search"
    "filter"
    "totalResults"
    "results"
    "pagination";
  @media (min-width: 900px) {
    /* Temp. column width restriction until new page layout is ready */
    grid-template-columns: 17rem var(--huge-space) minmax(auto, 660px);
    grid-template-rows: min-content var(--huge-space) var(--baseline-text-height) auto auto;
    grid-template-areas:
      ". . search"
      ". . ."
      "filterHeader . totalResults"
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

const FilterHeader = styled.div`
  grid-area: filterHeader;
`

const Filters = styled.div`
  grid-area: filter;
  border-top: 1px solid ${tokens.colors.text.static_icons__tertiary.hsla};
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
  align-items: baseline;
`

const TotalResults = styled.div`
  grid-area: totalResults;
  display: flex;
  align-items: baseline;
`

type Props = {
  serverState?: InstantSearchServerState
  serverUrl?: URL | string
  isServerRendered: boolean
  indexName: string
}

const HITS_PER_PAGE = 10

// Because there so many thing going on without this
const onStateChange = (params: any) => {
  params.setUiState(params.uiState)
}

const Search = ({ serverState, isServerRendered, indexName, serverUrl }: Props) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <InstantSearchSSRProvider {...serverState}>
    <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
      <InstantSearch
        searchClient={isServerRendered ? searchClientServer : searchClient}
        indexName={indexName}
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
            <SearchStatistics style={{ lineHeight: "var(--baseline-text-height)" }} hitsPerPage={HITS_PER_PAGE} />
          </TotalResults>
          <StyledHits>
            {/* @ts-ignore  */}
            <Hits hitComponent={Hit} />
          </StyledHits>
          <FilterHeader>
            <Header>
              <Heading level="h3" size="lg">
                <FormattedMessage id="search.filter.header" />
              </Heading>
              <CustomClearRefinement />
            </Header>
          </FilterHeader>
          <Filters>
            <RefinementList attribute="community">
              <FormattedMessage id="search.community.filter.header" />
            </RefinementList>
          </Filters>

          <PaginationContainer>
            <StyledPagination hitsPerPage={HITS_PER_PAGE} padding={1} />
          </PaginationContainer>
        </SearchContainer>
      </InstantSearch>
    </IntlProvider>
  </InstantSearchSSRProvider>
)

const SearchPage: NextPage<Props> = ({ serverState, isServerRendered = false, serverUrl, indexName }) => {
  const intl = useIntl()
  return (
    <Page documentTitle={intl.formatMessage({ id: "search.title" })}>
      <main>
        <Container highlight>
          <Heading level="h1" size="2xl" center style={{ marginBlock: tokens.spacings.comfortable.xxx_large }}>
            <FormattedMessage id="search.header" />
          </Heading>
          <Search
            serverState={serverState}
            indexName={indexName}
            isServerRendered={isServerRendered}
            serverUrl={serverUrl}
          />
        </Container>
      </main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const indexName = process.env.ALGOLIA_SEARCH_INDEX ?? ""

  if (indexName === "") {
    console.log("Missing the Algolia search index name")
  }

  const protocol = req.headers.referer?.split("://")[0] || "https"
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`

  const serverState = await getServerState(<Search serverUrl={serverUrl} isServerRendered indexName={indexName} />, {
    renderToString,
  })

  return {
    props: {
      serverState,
      serverUrl,
      indexName,
    },
  }
}

export default SearchPage
