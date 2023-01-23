import { List } from "@equinor/eds-core-react"
import { useHits } from "react-instantsearch-hooks-web"
import styled from "styled-components"

import { Hit } from "components/ImprovedSearch"

const { Item } = List

const HitItem = styled(Item)`
  margin-block: 1rem;
`

const StyledList = styled(List)`
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
  return (
    <StyledList variant="numbered">
      {hits.map((hit) => (
        <HitItem key={hit.objectID}>
          {/* @ts-ignore @TODO se på typene her */}
          <Hit hit={hit} />
        </HitItem>
      ))}
    </StyledList>
  )
}
