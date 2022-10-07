import { FunctionComponent } from "react"
import { FormattedMessage } from "react-intl"

type Props = {
  numberOfHits: number,
  numberOfFilters: number,
  query: string | string[]
}

export const SearchResultStats: FunctionComponent<Props> = (
  { numberOfHits, numberOfFilters, query },
) => {
  if (numberOfHits === 0 && numberOfFilters > 0) {
    return (
      <FormattedMessage
        id="search.no.results.with.filters"
        values={{
          numberOfFilters,
          searchTerm: (<b>{query}</b>),
        }}
      />
    )
  }
  return (
    <FormattedMessage
      id="search.results"
      values={{
        count: numberOfHits,
        searchTerm: (<b>{query}</b>),
      }}
    />
  )
}
