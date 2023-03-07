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
  &:first-child {
    margin-top: 0;
  }
`

const StyledList = styled(List)`
  padding: 0;
  list-style-type: none;
`

const NoresultContainer = styled.div`
  justify-content: center;
`

export const Hits = () => {
  const { hits } = useHits()
  const { query } = useSearchBox()

  if (!hits || hits.length === 0) {
    return (
      <NoresultContainer>
        <Typography group="paragraph" variant="body_short" style={{ textAlign: "center" }}>
          <FormattedMessage id="search.no.results.algolia" defaultMessage="No assets for this filter" />
        </Typography>
      </NoresultContainer>
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
