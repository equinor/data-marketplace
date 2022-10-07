import {
  Divider,
  Typography,
  Card,
  CircularProgress,
  List,
  Pagination,
} from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import React, {
  useMemo, MouseEvent, KeyboardEvent,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Link } from "components/Link"
import { Page } from "components/Page"
import { SearchResultStats, Filter } from "components/Search"
import { Section } from "components/Section"
import { useSearchResults } from "hooks"

const { Header: CardHeader, HeaderTitle: CardHeaderTitle } = Card
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
  const {
    searchResults = [], total, isLoading, error: searchResultError,
  } = useSearchResults()
  const router = useRouter()
  const intl = useIntl()

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

  const searchQuery = router.query.q

  return (
    <Page documentTitle={intl.formatMessage({ id: "search.title" })}>
      <main>
        <Section>
          <Typography variant="h1">
            {intl.formatMessage({ id: "search.header" })}
          </Typography>
          <SearchPageContainer>

            <aside>
              <Typography variant="h4" as="h2"><FormattedMessage id="search.filterHeader" /></Typography>
              <Divider variant="small" />

              <FieldSetStyle>
                <LegendC><FormattedMessage id="search.communitiesHeader" /></LegendC>
                <Filter />
              </FieldSetStyle>
            </aside>
            <div>
              {isLoading ? (
                <CircularProgress />
              )
                : (
                  <>
                    <SearchResultsHeader variant="body_short">
                      {!searchQuery || searchQuery === ""
                        ? <FormattedMessage id="search.no.query" />
                        : (
                          <SearchResultStats
                            numberOfHits={total}
                            numberOfFilters={numberOfFilters}
                            query={searchQuery}
                          />
                        )}
                    </SearchResultsHeader>

                    {searchResults.length > 0
                && (
                  <UnstyledList variant="numbered">
                    {searchResults.map((resource: any) => (
                      <SearchResultItem key={resource.id}>
                        <Link href={{ pathname: "/assets/[id]", query: { id: resource.id } }} title={resource.name}>
                          <Card elevation="raised">
                            <CardHeader>
                              <CardHeaderTitle>
                                <Typography variant="h5" as="h2">
                                  {resource.name}
                                </Typography>
                              </CardHeaderTitle>
                            </CardHeader>
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
                         defaultPage={Number.isNaN(Number(router.query.offset))
                           ? 1 : Number(router.query.offset) + 1}
                       />
                     </PaginationContainer>
                   )}
            </div>
          </SearchPageContainer>
        </Section>
      </main>
    </Page>
  )
}

export default Search
