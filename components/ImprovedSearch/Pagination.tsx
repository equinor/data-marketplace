import { Icon, List } from "@equinor/eds-core-react"
/* eslint-disable camelcase */
import { chevron_left, chevron_right, first_page, last_page } from "@equinor/eds-icons"
import { useContext, useEffect, useRef } from "react"
import { usePagination, UsePaginationProps } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { usePrefersReducedMotion } from "../../hooks/reducedMotion"

import { PaginationContext } from "./PaginationContext"
import { PaginationItem } from "./PaginationItem"


const PaginationList = styled(List)`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-gap: 8px;
  grid-auto-columns: min-content;
  grid-auto-flow: column;
`

export type PaginationProps = {
  hitsPerPage?: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & UsePaginationProps

export const Pagination = ({ totalPages, padding, hitsPerPage = 5, ...rest }: PaginationProps) => {
  const { refine, createURL, pages, currentRefinement, isFirstPage, isLastPage, nbPages, nbHits } = usePagination({
    totalPages,
    padding,
  })

  const { resultsRef } = useContext(PaginationContext)
  const prevRefinement = useRef<number>(currentRefinement)
  const prefersReducedMotion = usePrefersReducedMotion()
  const intl = useIntl()

  useEffect(() => {
    if (!prefersReducedMotion && resultsRef?.current && currentRefinement !== prevRefinement.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentRefinement, prefersReducedMotion, resultsRef])

  useEffect(() => {
    prevRefinement.current = currentRefinement
  }, [currentRefinement])

  if (!nbHits || nbHits === 0 || nbHits <= hitsPerPage) {
    return null
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <PaginationList {...rest}>
      <PaginationItem
        ariaLabel={intl.formatMessage({ id: "pagination.firstPage" })}
        value={0}
        isCurrent={false}
        isDisabled={isFirstPage}
        createURL={createURL}
        refine={refine}
      >
        <Icon data={first_page} />
      </PaginationItem>
      <PaginationItem
        ariaLabel={intl.formatMessage({ id: "pagination.previous" })}
        value={currentRefinement - 1}
        isCurrent={false}
        isDisabled={isFirstPage}
        createURL={createURL}
        refine={refine}
      >
        <Icon data={chevron_left} />
      </PaginationItem>

      {pages.map((page) => (
        <PaginationItem
          key={page}
          ariaLabel={`Page ${page + 1}`}
          value={page}
          isCurrent={page === currentRefinement}
          isDisabled={false}
          createURL={createURL}
          refine={refine}
        >
          {page + 1}
        </PaginationItem>
      ))}

      <PaginationItem
        ariaLabel={intl.formatMessage({ id: "pagination.next" })}
        value={currentRefinement + 1}
        isCurrent={false}
        isDisabled={isLastPage}
        createURL={createURL}
        refine={refine}
      >
        <Icon data={chevron_right} />
      </PaginationItem>

      <PaginationItem
        ariaLabel={intl.formatMessage({ id: "pagination.lastPage" })}
        value={nbPages - 1}
        isCurrent={false}
        isDisabled={isLastPage}
        createURL={createURL}
        refine={refine}
      >
        <Icon data={last_page} />
      </PaginationItem>
    </PaginationList>
  )
}
