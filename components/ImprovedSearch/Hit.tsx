import { Typography, Chip } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { Hit as AlgoliaHit } from "instantsearch.js"
import NextLink from "next/link"
import { Highlight, Snippet } from "react-instantsearch-hooks-web"
import styled from "styled-components"
// import type { SendEventForHits } from "instantsearch.js/es/lib/utils"

const StyledName = styled(Highlight)`
  & .highlighted {
    color: ${tokens.colors.interactive.danger__resting.hsla};
    background: ${tokens.colors.ui.background__default.hsla};
  }
`

const TruncatedExcerpt = styled(Highlight)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  & .highlighted {
    color: ${tokens.colors.interactive.danger__resting.hsla};
    background: ${tokens.colors.ui.background__default.hsla};
  }
`

const StyledSnippet = styled(Snippet)`
  display: block;
  color: ${tokens.colors.text.static_icons__default.hsla};
  padding-left: ${tokens.spacings.comfortable.xx_large};
  & .highlighted {
    color: ${tokens.colors.interactive.danger__resting.hsla};
    background: ${tokens.colors.ui.background__default.hsla};
  }
`

const StyledLink = styled(NextLink)`
  background-color: ${tokens.colors.ui.background__default.hsla};
  padding: ${tokens.spacings.comfortable.medium};
  text-decoration: none;
  display: block;
  &:focus-visible {
    outline: 2px dashed ${tokens.colors.infographic.primary__moss_green_100.hsla};
  }
`

const TagsContainer = styled.div`
  margin-top: ${tokens.spacings.comfortable.medium};
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacings.comfortable.small};
`

const StyledChip = styled(Chip)`
  background-color: ${tokens.colors.infographic.primary__moss_green_21.hsla};
  color: ${tokens.colors.text.static_icons__default.hsla};
`

const StyledTypography = styled(Typography)`
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1rem;
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
      <Typography variant="h5" as="h2">
        <StyledName
          hit={hit}
          attribute="name"
          classNames={{
            highlighted: "highlighted",
          }}
        />
      </Typography>
      <StyledTypography variant="body_short">
        <TruncatedExcerpt
          hit={hit}
          attribute="excerpt"
          classNames={{
            highlighted: "highlighted",
          }}
        />
      </StyledTypography>
      {hit.description && (
        <StyledTypography variant="body_short">
          <StyledSnippet
            hit={hit}
            attribute="description"
            classNames={{
              highlighted: "highlighted",
            }}
          />
        </StyledTypography>
      )}
      {tags.length > 0 && (
        <TagsContainer>
          {tags.map((item) => (
            <StyledChip key={item}>{item}</StyledChip>
          ))}
        </TagsContainer>
      )}
    </StyledLink>
  )
}
