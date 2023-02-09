import { List, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useHits, useSearchBox } from "react-instantsearch-hooks-web"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { Hit } from "./Hit"

const { Item } = List

const HitItem = styled(Item)`
  position: relative;
  margin-block: ${tokens.spacings.comfortable.large};
  border-bottom: 1px solid ${tokens.colors.ui.background__info.hsla};
`

const StyledList = styled(List)`
  padding: 0;
  list-style-type: none;
`

const NoRelevant = styled.span`
  justify-content: center;
`

/* 
type Props = {
  hitComponent: React.JSXElementConstructor<{
    hit: Hit
    sendEvent: SendEventForHits
  }>
} */

export const Hits = () => {
  const { hits } = useHits()
  const { query } = useSearchBox()

  if (!hits || hits.length === 0) {
    return (
      <StyledList variant="numbered">
        <NoRelevant>
          <Typography group="paragraph" variant="body_short" style={{ color: "Tertiary", textAlign: "center" }}>
            <FormattedMessage id="search.no.results.algolia" defaultMessage="No assets for this filter" />
          </Typography>
        </NoRelevant>
      </StyledList>
    )
  }
  return (
    <StyledList variant="numbered">
      {hits.map((hit) => (
        <HitItem key={hit.objectID}>
          {/* @ts-ignore @TODO se på typene her */}
          <Hit hit={hit} hasQuery={query !== ""} />
        </HitItem>
      ))}
    </StyledList>
  )
}
