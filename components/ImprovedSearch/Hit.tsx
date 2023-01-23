import { Card, Typography, Chip } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { Hit as AlgoliaHit } from "instantsearch.js"
import NextLink from "next/link"
import { Highlight } from "react-instantsearch-hooks-web"
import styled from "styled-components"
// import type { SendEventForHits } from "instantsearch.js/es/lib/utils"
const { Header: CardHeader, HeaderTitle: CardHeaderTitle } = Card

const StyledHightLight = styled(Highlight)`
  & .highlighted {
    background-color: ${tokens.colors.interactive.primary__selected_highlight.hsla};
  }
`

const StyledLink = styled(NextLink)`
  text-decoration: none;
`

export type HitProps = {
  hit: AlgoliaHit<{
    // @TODO Asset types
    name: string
    id: string
    community: string[]
  }>
  /*   sendEvent?: SendEventForHits */
} & HTMLDivElement

export const Hit = ({ hit }: HitProps) => {
  const { id, community = [] } = hit
  return (
    <StyledLink href={{ pathname: "/assets/[id]", query: { id } }}>
      <Card elevation="raised">
        <CardHeader>
          <CardHeaderTitle>
            {community.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
            <Typography variant="h5" as="h2" style={{ marginBlock: "0.4rem" }}>
              <StyledHightLight
                hit={hit}
                attribute="name"
                classNames={{
                  highlighted: "highlighted",
                }}
              />
            </Typography>
          </CardHeaderTitle>
        </CardHeader>
      </Card>
    </StyledLink>
  )
}
