import { Typography, Chip } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { Hit as AlgoliaHit, HitAttributeSnippetResult } from "instantsearch.js"
import NextLink from "next/link"
import { Highlight, Snippet } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Heading } from "components/Typography"
import { elevations } from "styles/globals"

const StyledName = styled(Highlight)`
  & .highlighted {
    background: var(--dusty-blue);
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
  color: var(--charcoal);
  & .highlighted {
    background: var(--dusty-blue);
    font-weight: 700;
    border-radius: var(--space-2);
  }
`

const StyledLink = styled(NextLink)`
  background-color: var(--white);
  padding: ${tokens.spacings.comfortable.medium};
  text-decoration: none;
  display: block;
  box-shadow: ${elevations.medium};
  &:focus-visible {
    outline: 2px dashed var(--outline-colour);
  }
`

const TagsContainer = styled.div`
  margin-top: ${tokens.spacings.comfortable.medium};
  display: flex;
  flex-wrap: wrap;
  gap: ${tokens.spacings.comfortable.small};
`

const TopContainer = styled.div`
  margin-top: ${tokens.spacings.comfortable.medium};
  display: flex;
  justify-content: space-between;
  gap: ${tokens.spacings.comfortable.large};
`

const StyledChip = styled(Chip)`
  background-color: rgb(255, 218, 168);
  color: var(--charcoal);
`

const StyledChipNew = styled(Chip)`
  background-color: var(--white);
  color: var(--charcoal);
  border: 2px solid rgb(255, 218, 168);
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
    createdAt: string
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

const isNewDataProduct = (hit: HitProps["hit"]) => {
  const currentDate = new Date()
  const compareDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1))
  const createdAtDate = new Date(hit.createdAt)
  return createdAtDate.getTime() >= compareDate.getTime()
}

export const Hit = ({ hit, hasQuery }: HitProps) => {
  const { id, community = [], tags = [] } = hit
  const intl = useIntl()

  if (isNewDataProduct(hit)) {
    return (
      <StyledLink href={{ pathname: "/assets/[id]", query: { id } }}>
        <TopContainer>
          {community &&
            community.map((item) => (
              <Typography variant="overline" style={{ fontSize: "0.75rem", fontWeight: "medium" }} key={item}>
                {item}
              </Typography>
            ))}
          <StyledChipNew style={{ fontSize: "0.75rem", fontWeight: "medium" }}>
            {intl.formatMessage({ id: "search.results.new.dataproduct" })}
          </StyledChipNew>
        </TopContainer>
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
