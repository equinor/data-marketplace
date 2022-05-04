import { Button, Typography } from "@equinor/eds-core-react"
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

const SearchResultCard = styled.li`

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
          <aside />
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
                      <Button variant="ghost_icon">List</Button>
                      <Button variant="ghost_icon">Grid</Button>
                    </div>
                  </div>

                  <SearchResultsList>
                    {searchResults.map((resource) => (
                      <SearchResultCard key={resource.id}>
                        <Typography>{resource.displayName}</Typography>
                        <Typography>
                          Last updated on
                          {" "}
                          {Intl.DateTimeFormat("nb").format(new Date(resource.lastModifiedOn))}
                        </Typography>
                        <Typography>Description</Typography>
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
