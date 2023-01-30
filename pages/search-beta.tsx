// eslint-disable-next-line import/extensions
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

import { SearchBox, Hits, Hit, RefinementList, algoliaNextJsHistoryRouter } from "components/ImprovedSearch"
import { Page } from "components/Page"
import { Section } from "components/Section"
import { searchClient, searchClientServer } from "config"
import englishTexts from "locales/english.json"

<<<<<<< HEAD
const Filters = styled.div``
=======
const StyledHits = styled(Hits)`
  /* Temporary styles */
  & .ais-Hits-list {
    list-style-type: none;
  }

  & .ais-Hits-item {
    margin-block: 1rem;
  }
`

const StyledFilters = styled.div`
  @media (min-width: 800px) {
    display: grid;
    grid-template-rows: var(--space-56) min-content min-content;
  }
`
>>>>>>> 081bed4 (Dtyling changes for filter)

const SearchContainer = styled.div`
  display: grid;
  @media (min-width: 900px) {
    grid-template-columns: 14rem 1fr;
  }
`

const FilterContainer = styled.div`
  display: grid;
  @media (min-width: 300px) {
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
<<<<<<< HEAD
        <Configure hitsPerPage={50} snippetEllipsisText="..." attributesToSnippet={["excerpt:35", "description:15"]} />
        <SearchBox />
        <RefinementList attribute="community" />
=======
        <div>
        <RefinementList attribute="community" />
        </div>
        <Configure hitsPerPage={50} snippetEllipsisText="..." attributesToSnippet={["excerpt", "description"]} />
        
        <SearchBox />
      
>>>>>>> 081bed4 (Dtyling changes for filter)
        {/* @ts-ignore  */}
        <Hits hitComponent={Hit} />
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
          <SearchContainer>
<<<<<<< HEAD
            <filter>filter</filter>

=======
           
>>>>>>> 081bed4 (Dtyling changes for filter)
            <div>
              <Search serverState={serverState} isServerRendered={isServerRendered} serverUrl={serverUrl} />
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
