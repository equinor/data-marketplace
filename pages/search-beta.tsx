import { Hit as AlgoliaHit } from "instantsearch.js"
// eslint-disable-next-line import/extensions
import { history } from "instantsearch.js/es/lib/routers/index.js"
import type { NextPage, GetServerSideProps } from "next/types"
import { renderToString } from "react-dom/server"
import { getServerState } from "react-instantsearch-hooks-server"
import {
  Configure,
  InstantSearch,
  Hits,
  Highlight,
  SearchBox,
  InstantSearchServerState,
  InstantSearchSSRProvider,
} from "react-instantsearch-hooks-web"

import { Page } from "components/Page"
import { searchClient, searchClientServer } from "config"

type Props = {
  serverState?: InstantSearchServerState
  serverUrl: URL | string
  isServerRendered: boolean
  featureFlags?: {
    USE_IMPROVED_SEARCH: "true" | "false"
  }
}

type HitProps = {
  hit: AlgoliaHit<{
    name: string
    price: number
  }>
}

const Hit = ({ hit }: HitProps) => (
  <>
    <Highlight hit={hit} attribute="name" className="Hit-label" />
    <span className="Hit-price">${hit.price}</span>
  </>
)

const Search = ({ serverState, isServerRendered, serverUrl }: Props) => (
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  <InstantSearchSSRProvider {...serverState}>
    <InstantSearch
      searchClient={isServerRendered ? searchClientServer : searchClient}
      indexName="test_assets"
      routing={{
        router: history({
          /*  @ts-ignore */
          getLocation: () => (typeof window === "undefined" ? new URL(serverUrl) : window.location),
        }),
      }}
    >
      <Configure hitsPerPage={50} snippetEllipsisText="..." />
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
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
        <h1>Beta version for improved search</h1>
        <Search serverState={serverState} isServerRendered={isServerRendered} serverUrl={serverUrl} />
      </main>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const protocol = req.headers.referer?.split("://")[0] || "https"
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`
  const serverState = await getServerState(<Search serverUrl={serverUrl} isServerRendered />, { renderToString })
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
