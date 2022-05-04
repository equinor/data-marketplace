import {
  Button, Card, Icon, Typography,
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

const SearchResultsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`

const SearchResultCard = styled(Card).attrs(() => ({ as: "li" }))`
  box-shadow: ${tokens.elevation.raised};
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
        <Container>
          <aside>
            <Typography>Filter</Typography>

            <div>
              <Typography>Tags</Typography>
              <div>
                {Array.from({ length: 5 }).map((tag, i) => (
                  <Typography key={`tag-${i + 1}`}>
                    Tag
                    {" "}
                    {i + 1}
                  </Typography>
                ))}
              </div>
            </div>
          </aside>

          <main>
            <Section>
              {searchResults.length > 0 ? (
                <>
                  <div>
                    <Typography>
                      {searchResults.length}
                      {" "}
                      Results
                    </Typography>

                    <div>
                      <Typography>View</Typography>
                      <Button variant="ghost_icon" color="secondary">
                        <Icon data={list} />
                      </Button>
                      <Button variant="ghost_icon" color="secondary">
                        <Icon data={gridOn} />
                      </Button>
                    </div>
                  </div>

                  <SearchResultsList>
                    {searchResults.map((resource) => (
                      <SearchResultCard key={resource.id}>
                        <Card.Header>
                          <Typography>{resource.displayName}</Typography>
                          <Typography>
                            Last updated on
                            {" "}
                            {Intl.DateTimeFormat("nb").format(new Date(resource.lastModifiedOn))}
                          </Typography>
                        </Card.Header>

                        <Card.Content>
                          <Typography>Description</Typography>
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
        </Container>
      </Page>
    </FullPageSpinner>
  )
}

export default Search
