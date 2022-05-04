import {
  Button,
  Card,
  Divider,
  Icon,
  Typography,
} from "@equinor/eds-core-react"
import { grid_on as gridOn, list } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "styled-components"

import { Container } from "../components/Container"
import { FullPageSpinner } from "../components/FullPageSpinner/FullPageSpinner"
import { Page } from "../components/Page"
import { Section } from "../components/Section"
import { HttpClient } from "../lib/HttpClient"

const SearchPageContainer = styled(Container)`
  display: grid;
  grid-template-columns: 15rem 1fr;
  grid-gap: 2.5rem;
  align-items: baseline;
`

const SearchResultsHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
`

const ViewModeActionsContainer = styled.div`
  display: flex;
  align-items: center;

  > *:first-child {
    margin-right: 0.5rem;
  }
`

const FilterSection = styled.div`
  &:not(:last-child) {
    margin-bottom: 1.25rem;
  }
`

const FilterSectionHeadline = styled(Typography).attrs(() => ({ variant: "body_short_bold" }))`
  margin-bottom: 0.5rem;
`

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-gap: 0.25rem;
`

const Tag = styled.span`
  padding: 0.25rem 0.5rem calc(0.25rem + 1px);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  background-color: ${tokens.colors.ui.background__info.hex};
`

const SearchResultsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`

const SearchResultCard = styled(Card).attrs(() => ({ as: "li" }))`
  box-shadow: ${tokens.elevation.raised};
  border-radius: ${tokens.shape.corners.borderRadius};

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`

const MetaContainer = styled.div`
  margin-bottom: 1rem;
`

const Search: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const router = useRouter()

  useEffect(() => {
    setIsLoading(true)

    if (router.query.q) {
      (async () => {
        try {
          const { body } = await HttpClient.post("/api/collibra/search", {
            body: {
              keywords: router.query.q,
            },
          })

          setSearchResults(body.results.map((result: any) => result.resource))
        } catch (error) {
          console.error("[Search] Failed fetching search results", error)
        }
      })()
    }

    setIsLoading(false)
  }, [router])

  return (
    <FullPageSpinner show={isLoading}>
      <Page>
        <SearchPageContainer>
          <aside>
            <Typography variant="h5" as="p">Filter</Typography>
            <Divider variant="small" />

            <FilterSection>
              <FilterSectionHeadline>Communities</FilterSectionHeadline>

              <TagsContainer>
                {Array.from({ length: 5 }).map((_community, i) => (
                  <Tag key={`community-${i + 1}`}>
                    Community
                    {" "}
                    {i + 1}
                  </Tag>
                ))}
              </TagsContainer>
            </FilterSection>
          </aside>

          <main>
            <Section>
              {searchResults.length > 0 ? (
                <>
                  <SearchResultsHeader>
                    <Typography variant="body_short">
                      {searchResults.length}
                      {" "}
                      Results
                    </Typography>

                    <ViewModeActionsContainer>
                      <Typography variant="body_short">View</Typography>

                      <Button variant="ghost_icon" color="secondary">
                        <Icon data={list} />
                      </Button>

                      <Button variant="ghost_icon" color="secondary">
                        <Icon data={gridOn} />
                      </Button>
                    </ViewModeActionsContainer>
                  </SearchResultsHeader>

                  <SearchResultsList>
                    {searchResults.map((resource) => (
                      <SearchResultCard key={resource.id}>
                        <Card.Header>
                          <Typography variant="h4" as="p">{resource.displayName}</Typography>
                        </Card.Header>

                        <Card.Content>
                          <MetaContainer>
                            <Typography variant="caption">
                              Last updated on
                              {" "}
                              {Intl.DateTimeFormat("nb").format(new Date(resource.lastModifiedOn))}
                            </Typography>
                          </MetaContainer>

                          <Typography variant="body_short">Description</Typography>
                        </Card.Content>
                      </SearchResultCard>
                    ))}
                  </SearchResultsList>
                </>
              ) : (
                <Typography>
                  We were not able to find anything related to
                  {" "}
                  <b>
                    &quot;
                    {router.query.q}
                    &quot;
                  </b>
                </Typography>
              )}
            </Section>
          </main>
        </SearchPageContainer>
      </Page>
    </FullPageSpinner>
  )
}

export default Search
