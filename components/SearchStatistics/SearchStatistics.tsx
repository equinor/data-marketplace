import { Typography } from "@equinor/eds-core-react"
import { FunctionComponent } from "react"
import { usePagination } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"

type Props = {
  hitsPerPage: number
}

export const SearchStatistics: FunctionComponent<Props> = ({ hitsPerPage }) => {
  const { nbHits: totalHits, currentRefinement } = usePagination()
  const { formatMessage } = useIntl()

  if (totalHits === 0) {
    return <Typography>{formatMessage({ id: "search.noresult.statistics" })}</Typography>
  }

  const currentOffset = currentRefinement * hitsPerPage + 1
  const offsetEnd = Math.min(currentRefinement * hitsPerPage + hitsPerPage, totalHits)

  return <Typography>{formatMessage({ id: "search.statistics" }, { currentOffset, offsetEnd, totalHits })}</Typography>
}
