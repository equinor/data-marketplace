import { List } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useHits, useSearchBox } from "react-instantsearch-hooks-web"
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
  console.log("query", query, query === "")
  return (
    <StyledList variant="numbered">
      {hits.map((hit) => (
        <HitItem key={hit.objectID}>
          {/* @ts-ignore @TODO se på typene her */}
          <Hit hit={hit} query={query !== ""} />
        </HitItem>
      ))}
    </StyledList>
  )
}
