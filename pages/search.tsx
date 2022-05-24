import {
  Button,
  Divider,
  EdsProvider,
  Icon,
  Typography,
} from "@equinor/eds-core-react"
import { grid_on as gridOn, list } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled, { css } from "styled-components"

import { Container } from "../components/Container"
import { FullPageSpinner } from "../components/FullPageSpinner/FullPageSpinner"
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

const Tag = styled(Button)<{ active: boolean }>`
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

const SearchResultsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`

const SearchResultCard = styled.li`
  box-shadow: ${tokens.elevation.raised};
  border-radius: ${tokens.shape.corners.borderRadius};
  padding: 2rem;

  &:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  a > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const TruncatedDescription = styled(Typography)<{ lines?: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ lines }) => (lines && lines > 0 ? lines : 4)};
  overflow: hidden;
`

const Search: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [communities, setCommunities] = useState<any[]>([])
  const [searchResults, setSearchResults] = useState<any[]>([])

  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const { body } = await HttpClient.get("/api/collibra/communities", {
          headers: { authorization: `Bearer ${localStorage.getItem("access_token")}` },
          query: {
            // TODO: get this ID from Collibra
            parentId: "1f63fe17-a732-4779-a290-db088803761c",
          },
        })
        setCommunities(body.results)
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
    let { community } = router.query

    if (!community) {
      community = id
    } else if (typeof community === "string") {
      if (community === id) {
        community = undefined
      } else {
        community = [community, id]
      }
    } else {
      const existingIdx = community.findIndex((f) => f === id)
      if (existingIdx === -1) {
        community.push(id)
      } else {
        community = [
          ...community.slice(0, existingIdx),
          ...community.slice(existingIdx + 1, community.length),
        ]
      }
    }

    router.push({
      pathname: router.pathname,
      query: { ...router.query, community },
    })
  }

  return (
    <FullPageSpinner show={isLoading}>
      <SearchPageContainer>
        <aside>
          <Typography variant="h5" as="p">Filter</Typography>
          <Divider variant="small" />

          <FilterSection>
            <FilterSectionHeadline>Communities</FilterSectionHeadline>

            <TagsContainer>
              <EdsProvider density="compact">
                {communities.map((community) => (
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
                      <Link href={{ pathname: "/assets/[assetId]", query: { assetId: resource.id } }}>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a>
                          <div>
                            <Typography variant="h4" as="p">{resource.displayName}</Typography>
                          </div>

                          <Typography variant="caption">
                            Last updated on
                            {" "}
                            {Intl.DateTimeFormat("nb").format(new Date(resource.lastModifiedOn))}
                          </Typography>

                          <div>

                            {/*
                              * html strings are sanitized in backend at this point,
                              * so we should(TM) be safe to do this
                              */}
                            <TruncatedDescription variant="body_long" dangerouslySetInnerHTML={{ __html: resource.description }} />
                          </div>
                        </a>
                      </Link>
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
    </FullPageSpinner>
  )
}

export default Search
