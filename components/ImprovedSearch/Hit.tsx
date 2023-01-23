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

const TagsContainer = styled.div`
  display: flex;
  gap: ${tokens.spacings.comfortable.small};
`

export type HitProps = {
  hit: AlgoliaHit<{
    // @TODO Asset types
    name: string
    id: string
    community: string[]
    tags: string[]
  }>
  /*   sendEvent?: SendEventForHits */
} & HTMLDivElement

export const Hit = ({ hit }: HitProps) => {
  const { id, community = [], tags = [] } = hit
  return (
    <StyledLink href={{ pathname: "/assets/[id]", query: { id } }}>
      <Card elevation="raised">
        <CardHeader>
          <CardHeaderTitle>
            {community.map((item) => (
              <Typography variant="overline" key={item}>
                {item}
              </Typography>
            ))}
            <Typography variant="h5" as="h2" style={{ marginBottom: "0.65rem" }}>
              <StyledHightLight
                hit={hit}
                attribute="name"
                classNames={{
                  highlighted: "highlighted",
                }}
              />
            </Typography>
            {tags.length > 0 && (
              <TagsContainer>
                {tags.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </TagsContainer>
            )}
          </CardHeaderTitle>
        </CardHeader>
      </Card>
    </StyledLink>
  )
}
