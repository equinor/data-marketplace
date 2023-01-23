import { List } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useHits } from "react-instantsearch-hooks-web"
import styled from "styled-components"

import { Hit } from "components/ImprovedSearch"

const { Item } = List

const HitItem = styled(Item)`
  &:not(:last-child) {
    margin-block: ${tokens.spacings.comfortable.large};
  }
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
