import {
  Divider,
  EdsProvider,
  Typography,
  Card,
  CircularProgress,
  Checkbox,
  List,
  Pagination,

} from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import React, {
  useEffect, useState, useMemo, MouseEvent, KeyboardEvent,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Container } from "components/Container"
import { Footer } from "components/Footer"
import { Link } from "components/Link"
import { Section } from "components/Section"
import { TruncatedDescription } from "components/helpers"
import { useSearchResults } from "hooks"
import { HttpClient } from "lib/HttpClient"
import { updateCommunityFilter } from "lib/updateCommunityFilter"

const { Header: CardHeader, HeaderTitle: CardHeaderTitle, Content: CardContent } = Card
const { Item } = List

const SearchPageContainer = styled.div`
  margin-top: ${tokens.spacings.comfortable.x_large};
  display: grid;
  grid-template-columns: 15rem 1fr;
  grid-gap: ${tokens.spacings.comfortable.xx_large};
`

const SearchResultsHeader = styled(Typography)`
  margin-bottom: ${tokens.spacings.comfortable.medium};
  /* Same line height as the filter header, pixel perfect ftw */
  line-height: 1.600em;
`

const CheckboxContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-gap:${tokens.spacings.comfortable.x_small};
  
`

const UnstyledList = styled(List)`
  list-style: none;
  padding: 0; 
`

const FieldSetStyle = styled.fieldset`
  border: 0;
  padding: 0;
  
`
const LegendC = styled.legend`
  margin-bottom: ${tokens.spacings.comfortable.small};
`
/* Needs a wrapper because if we use the Pagination Component, the class is added to the
pagination nav, not the container containing the with item results component */
const PaginationContainer = styled.div`
  margin-top: ${tokens.spacings.comfortable.large};
`

const SearchResultItem = styled(Item)`
  &:not(:last-child) {
    margin-bottom: ${tokens.spacings.comfortable.large};
  }
`

const HITS_PER_PAGE = 20

const Search: NextPage = () => {
  const [communities, setCommunities] = useState<any[]>([])
  const {
    searchResults = [], total, isLoading, error: searchResultError,
  } = useSearchResults()
  const router = useRouter()
  const intl = useIntl()

  useEffect(() => {
    (async () => {
      try {
        const { body } = await HttpClient.get("/api/communities")
        setCommunities(body)
      } catch (error) {
        console.error("[Search] Failed fetching communities", error)
      }
    })()
  }, [])

  const onCommunityFilterClick = (id: string) => {
    const filters = updateCommunityFilter(id, router.query.community)
    router.push({
      pathname: router.pathname,
      query: { ...router.query, community: filters },
    })
  }

  const onPaginationChange = (event: MouseEvent | KeyboardEvent | null, page: number) => {
    const offset = page - 1
    router.replace(
      { query: { ...router.query, offset } },
      { query: { ...router.query, offset } },
      { shallow: true },
    )
  }
  const numberOfFilters = useMemo(() => {
    const appliedFilters = router.query.community
    if (!appliedFilters) return 0
    if (typeof appliedFilters === "string") {
      return 1
    }
    return appliedFilters.length
  }, [router.query.community])

  if (searchResultError) {
    console.log("[Search] Failed fetching search results", searchResultError)
  }

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: "search.title" })}</title>
      </Head>
      <main>
        <Container>
          <Typography variant="h1">
            {intl.formatMessage({ id: "search.header" })}
          </Typography>
          <SearchPageContainer>

            <aside>
              <Typography variant="h4" as="h2"><FormattedMessage id="search.filterHeader" /></Typography>
              <Divider variant="small" />

              <FieldSetStyle>
                <LegendC><FormattedMessage id="search.communitiesHeader" /></LegendC>
                <CheckboxContainer>
                  <EdsProvider density="compact">
                    {communities?.map((community) => (
                      <UnstyledList key={community.id}>
                        <Item>
                          <Checkbox
                            label={community.name}
                            key={community.id}
                            checked={!!router.query.community?.includes(community.id)}
                            onChange={() => onCommunityFilterClick(community.id)}
                          />
                        </Item>
                      </UnstyledList>
                    ))}
                  </EdsProvider>
                </CheckboxContainer>
              </FieldSetStyle>
            </aside>

            <Section>
              {isLoading ? (
                <CircularProgress />
              )
                : (
                  <>
                    <SearchResultsHeader variant="body_short">
                      {searchResults.length === 0 && numberOfFilters > 0
                        ? (
                          <FormattedMessage
                            id="search.no.results.with.filters"
                            values={{
                              numberOfFilters,
                              searchTerm: (<b>{router.query.q}</b>),
                            }}
                          />
                        )
                        : (
                          <FormattedMessage
                            id="search.results"
                            values={{
                              count: total,
                              searchTerm: (<b>{router.query.q}</b>),
                            }}
                          />
                        ) }
                    </SearchResultsHeader>

                    {searchResults.length > 0
                && (
                  <UnstyledList variant="numbered">
                    {searchResults.map((resource: any) => (
                      <SearchResultItem key={resource.id}>
                        <Link href={{ pathname: "/assets/[id]", query: { id: resource.id } }} title={resource.name}>
                          <Card elevation="raised" onClick={() => {}}>
                            <CardHeader>
                              <CardHeaderTitle>
                                <Typography variant="h5" as="h2">
                                  {resource.name}
                                </Typography>
                              </CardHeaderTitle>
                            </CardHeader>
                            <CardContent>
                              <Typography variant="caption">
                                {intl.formatMessage({ id: "search.lastUpdated" })}
                                {": "}
                                {intl.formatDate(new Date(resource.lastModifiedOn), { day: "2-digit", year: "numeric", month: "long" })}
                              </Typography>
                              <TruncatedDescription variant="body_long" lines={3} dangerouslySetInnerHTML={{ __html: resource.description }} />
                            </CardContent>
                          </Card>
                        </Link>
                      </SearchResultItem>
                    ))}

                  </UnstyledList>
                )}
                  </>
                )}
              {total !== undefined && total > HITS_PER_PAGE
                   && (
                     <PaginationContainer>
                       <Pagination
                         itemsPerPage={HITS_PER_PAGE}
                         onChange={onPaginationChange}
                         totalItems={total}
                         withItemIndicator
                       />
                     </PaginationContainer>
                   )}
            </Section>

          </SearchPageContainer>
        </Container>
      </main>
      <Footer />
    </>
  )
}

export default Search
