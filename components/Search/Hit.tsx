import { Typography, Chip } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { Hit as AlgoliaHit, HitAttributeSnippetResult } from "instantsearch.js"
import NextLink from "next/link"
import { Highlight, Snippet } from "react-instantsearch-hooks-web"
import styled from "styled-components"

import { Heading } from "components/Typography"
import { elevations } from "styles/globals"

const StyledName = styled(Highlight)`
  & .highlighted {
    background: var(--hit-highlight);
    border-radius: var(--space-2);
  }
`

const TruncatedStaticExcerpt = styled(Typography)`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

const StyledSnippet = styled(Snippet)`
  display: block;
  color: ${tokens.colors.text.static_icons__default.hsla};
  & .highlighted {
    background: var(--hit-highlight);
    font-weight: 700;
    border-radius: var(--space-2);
  }
`

const StyledLink = styled(NextLink)`
  background-color: ${tokens.colors.ui.background__default.hsla};
  padding: ${tokens.spacings.comfortable.medium};
  text-decoration: none;
  display: block;
  box-shadow: ${elevations.medium};
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
  background-color: rgb(255, 218, 168);
  color: ${tokens.colors.text.static_icons__default.hsla};
`

const StyledTypography = styled(Typography)`
  margin-bottom: 1rem;
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
  hasQuery: boolean
} & HTMLDivElement

/* We want to show only one attribute as the snippet, preferrably the excerpt.
If neither the excerpt or the description is a match (like the match can be for
  a resonsible person) we will fallback to either the excerpt or description, like
  in the static text without any query)
*/
const getSnippetAttribute = (hit: HitProps["hit"]) => {
  // eslint-disable-next-line no-underscore-dangle
  const excerptSnippet = hit._snippetResult?.excerpt as HitAttributeSnippetResult
  // eslint-disable-next-line no-underscore-dangle
  const descriptionSnippet = hit._snippetResult?.description as HitAttributeSnippetResult
  if (hit.excerpt && excerptSnippet && excerptSnippet.matchLevel === ("full" || "partial")) {
    return "excerpt"
    /* eslint no-else-return: "error"  */
  } else if (hit.description && descriptionSnippet && descriptionSnippet.matchLevel === ("full" || "partial")) {
    return "description"
  }
  return hit.excerpt ? "excerpt" : "description"
}

export const Hit = ({ hit, hasQuery }: HitProps) => {
  const { id, community = [], tags = [] } = hit

  return (
    <StyledLink href={{ pathname: "/assets/[id]", query: { id } }}>
      {community &&
        community.map((item) => (
          <Typography variant="overline" style={{ fontSize: "0.75rem", fontWeight: "medium" }} key={item}>
            {item}
          </Typography>
        ))}

      <Heading size="lg" level="h2" bold style={{ marginBottom: tokens.spacings.comfortable.medium }}>
        <StyledName
          hit={hit}
          attribute="name"
          classNames={{
            highlighted: "highlighted",
          }}
        />
      </Heading>
      {hasQuery ? (
        <StyledTypography variant="body_short">
          <StyledSnippet
            hit={hit}
            attribute={getSnippetAttribute(hit)}
            classNames={{
              highlighted: "highlighted",
            }}
          />
        </StyledTypography>
      ) : (
        <TruncatedStaticExcerpt variant="body_short">{hit.excerpt || hit.description}</TruncatedStaticExcerpt>
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
