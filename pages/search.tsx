import {
  Button,
  Divider,
  EdsProvider,
  Icon,
  Typography,
  Card,
  CircularProgress,
  List,
} from "@equinor/eds-core-react"
import { grid_on as gridOn, list } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled, { css } from "styled-components"

import { Container } from "../components/Container"
import { Footer } from "../components/Footer"
import { Link } from "../components/Link"
import { Section } from "../components/Section"
import { TruncatedDescription } from "../components/helpers"
import { HttpClient } from "../lib/HttpClient"
import { updateCommunityFilter } from "../lib/updateCommunityFilter"

const { Header: CardHeader, HeaderTitle: CardHeaderTitle, Content: CardContent } = Card
const { Item } = List

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

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
`

const ViewModeActionsContainer = styled.div`
  display: flex;
  align-items: center;

  > *:first-child {
    margin-right: 0.5rem;
  }
`

const FilterSection = styled(Section)`
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
  grid-gap: 0.5rem;
`

const Tag = styled(Button) <{ active: boolean }>`
  padding: 0 0.5rem;
  font-size: 0.75rem;
  background-color: ${tokens.colors.infographic.primary__moss_green_13.rgba};
  border: none;
  color: ${tokens.colors.text.static_icons__default.hex};
  ${({ active }) => active && css`
    box-shadow: 0 0 0 2px ${tokens.colors.infographic.primary__moss_green_55.rgba};
  `}

  &:hover {
    background-color: ${tokens.colors.infographic.primary__moss_green_34.rgba};
    border: none;
  }
`

const SearchResultsList = styled(List)`
  list-style: none;
`

const SearchResultItem = styled(Item)`
  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`

const Search: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [communities, setCommunities] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])

  const router = useRouter()
  const intl = useIntl()

  useEffect(() => {
    (async () => {
      try {
        const { body } = await HttpClient.get("/api/communities", {
          headers: { authorization: `Bearer ${localStorage.getItem("access_token")}` },
        })
        setCommunities(body)
      } catch (error) {
        console.error("[Search] Failed fetching communities", error)
      }
    })()
  }, [])

  useEffect(() => {
    setIsLoading(true)

    if (router.query.q) {
      (async () => {
        try {
          const { body } = await HttpClient.get("/api/search", {
            headers: { authorization: `Bearer ${localStorage.getItem("access_token")}` },
            query: router.query,
          })

          setSearchResults(body.results.map((result: any) => result.resource))
          setIsLoading(false)
        } catch (error) {
          console.error("[Search] Failed fetching search results", error)
          setIsLoading(false)
        }
      })()
    }
  }, [router])

  const onCommunityFilterClick = (id: string) => {
    const filters = updateCommunityFilter(id, router.query.community)

    router.push({
      pathname: router.pathname,
      query: { ...router.query, community: filters },
    })
  }

  return (
    isLoading ? (
      <SpinnerContainer>
        <CircularProgress />
      </SpinnerContainer>
    ) : (
      <>
        <SearchPageContainer>
          <aside>
            <Typography variant="h4" as="h2"><FormattedMessage id="search.filterHeader" /></Typography>
            <Divider variant="small" />

            <FilterSection>
              <FilterSectionHeadline><FormattedMessage id="search.communitiesHeader" /></FilterSectionHeadline>

              <TagsContainer>
                <EdsProvider density="compact">
                  {communities?.map((community) => (
                    <Tag
                      active={!!router.query.community?.includes(community.id)}
                      key={community.id}
                      onClick={() => onCommunityFilterClick(community.id)}
                    >
                      {community.name}
                    </Tag>
                  ))}
                </EdsProvider>
              </TagsContainer>
            </FilterSection>
          </aside>

          <main>
            <Section>

              <SearchResultsHeader>
                <Typography variant="body_short">
                  <FormattedMessage
                    id="search.statistic"
                    values={{
                      count: searchResults.length,
                      searchTerm: (<b>{router.query.q}</b>),
                    }}
                  />
                </Typography>

                {searchResults.length > 0
                && (
                  <ViewModeActionsContainer>
                    <Typography variant="body_short"><FormattedMessage id="search.view" /></Typography>

                    <Button variant="ghost_icon" color="secondary">
                      <Icon data={list} />
                    </Button>

                    <Button variant="ghost_icon" color="secondary">
                      <Icon data={gridOn} />
                    </Button>
                  </ViewModeActionsContainer>
                )}
              </SearchResultsHeader>

              {searchResults.length > 0
              && (
                <SearchResultsList variant="numbered">
                  {searchResults.map((resource) => (
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
                              {" : "}
                              {Intl.DateTimeFormat("nb").format(new Date(resource.lastModifiedOn))}
                            </Typography>
                            <TruncatedDescription variant="body_long" lines={3} dangerouslySetInnerHTML={{ __html: resource.description }} />
                          </CardContent>
                        </Card>
                      </Link>
                    </SearchResultItem>
                  ))}

                </SearchResultsList>
              )}

            </Section>
          </main>
        </SearchPageContainer>
        <Footer />
      </>
    )
  )
}

export default Search
