import { Typography, Chip } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { Hit as AlgoliaHit } from "instantsearch.js"
import NextLink from "next/link"
import { Highlight, Snippet } from "react-instantsearch-hooks-web"
import styled from "styled-components"
// import type { SendEventForHits } from "instantsearch.js/es/lib/utils"

const StyledName = styled(Highlight)`
  & .highlighted {
    /* Just testing out some colour contrast */
    color: hsla(34, 100%, 74%, 1);
    /* color: ${tokens.colors.interactive.warning__text.hsla}; */
    background-color: hsl(207, 25%, 24%);
  }
`

const StyledSnippet = styled(Snippet)`
  display: block;
  color: ${tokens.colors.text.static_icons__default.hsla};
  & .highlighted {
    background-color: ${tokens.colors.interactive.primary__selected_highlight.hsla};
  }
`

const StyledLink = styled(NextLink)`
  text-decoration: none;
  display: block;
  &:focus-visible {
    outline: 2px dashed ${tokens.colors.infographic.primary__moss_green_100.hsla};
  }
`

const TagsContainer = styled.div`
  margin-top: ${tokens.spacings.comfortable.medium};
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
    description: string
    excerpt: string
  }>
  /*   sendEvent?: SendEventForHits */
} & HTMLDivElement

export const Hit = ({ hit }: HitProps) => {
  const { id, community = [], tags = [] } = hit
  return (
    <StyledLink href={{ pathname: "/assets/[id]", query: { id } }}>
      {community.map((item) => (
        <Typography variant="overline" key={item}>
          {item}
        </Typography>
      ))}
      <Typography variant="h5" as="h2" style={{ marginBottom: "0.65rem" }}>
        <StyledName
          hit={hit}
          attribute="name"
          classNames={{
            highlighted: "highlighted",
          }}
        />
      </Typography>
      {hit.excerpt && (
        <Typography variant="body_short">
          <StyledSnippet
            hit={hit}
            attribute="excerpt"
            classNames={{
              highlighted: "highlighted",
            }}
          />
        </Typography>
      )}
      {hit.description && (
        <Typography variant="body_short">
          <StyledSnippet
            hit={hit}
            attribute="description"
            classNames={{
              highlighted: "highlighted",
            }}
          />
        </Typography>
      )}
      {tags.length > 0 && (
        <TagsContainer>
          {tags.map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </TagsContainer>
      )}
    </StyledLink>
  )
}
