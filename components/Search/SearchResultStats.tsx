import { FunctionComponent } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
  numberOfHits: number | null
  numberOfFilters: number
  query: string | string[]
}

// Sorry future self for way too many returns here, but
// this logic will be completely different with Algolia
export const SearchResultStats: FunctionComponent<Props> = ({ numberOfHits, numberOfFilters, query }) => {
  // loose null assertion catches both null and undefined
  if (numberOfHits == null) return null

  // No results and that's probably because of the use of community filter/s
  if (numberOfHits === 0 && numberOfFilters > 0) {
    return (
      <FormattedMessage
        id="search.no.results.with.filters"
        values={{
          numberOfFilters,
          searchTerm: <b>{query}</b>,
        }}
      />
    )
  }

  return (
    <FormattedMessage
      id="search.results"
      values={{
        count: numberOfHits,
        searchTerm: <b>{query}</b>,
      }}
    />
  )
}
