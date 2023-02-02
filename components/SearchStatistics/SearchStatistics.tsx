import { Typography } from "@equinor/eds-core-react"
import { FunctionComponent } from "react"
import { usePagination } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"

type Props = {
  pageSize: number
}

export const SearchStatistics: FunctionComponent<Props> = ({ pageSize }) => {
  const { nbHits: totalHits, currentRefinement } = usePagination()
  const { formatMessage } = useIntl()

  if (totalHits === 0) {
    return null
  }

  const currentOffset = currentRefinement * pageSize + 1
  const offsetEnd = Math.min(currentRefinement * pageSize + pageSize, totalHits)

  return <Typography>{formatMessage({ id: "search.statistics" }, { currentOffset, offsetEnd, totalHits })}</Typography>
}
