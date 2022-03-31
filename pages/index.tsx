import { Card, Search, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  ChangeEventHandler, FormEventHandler, useEffect, useState,
} from "react"
import styled from "styled-components"

import { Page } from "../components/Page"
import { fmtNumber } from "../lib/fmtNumber"

const Section = styled.section`
  width: 100%;
  padding: 0 5rem;

  &:not(:last-child) {
    margin-bottom: 5rem;
  }
`

const SearchBarSection = styled(Section)`
  max-width: 42rem;
  margin: 5rem auto auto;
`

const SearchForm = styled.form`
  >:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`

const SearchBar = styled(Search)`
  height: 3.5rem;
  padding: 0 0.75rem;
  border-radius: 0.25rem;

  > svg {
    height: 1.75rem;
    width: 1.75rem;
  }

  input {
    height: 100%;
    font-size: 1.25rem;
    padding: 0.5rem 0.5rem calc(0.5rem + 1px);
  }

  button {
    height: 1.75rem;
    width: 1.75rem;

    svg {
      height: 1.5rem;
      width: 1.5rem;
    }
  }
`

const TagsContainer = styled.div`
  > p {
    margin-bottom: 0.25rem;
  }

  > div {
    display: flex;
  }
`

const Tag = styled.span`
  padding: 0.25rem 0.5rem calc(0.25rem + 1px);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  background-color: ${tokens.colors.ui.background__info.hex};

  &:not(:last-child) {
    margin-right: 0.25rem;
  }
`

const SectionHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.5rem;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1.5rem;
`

const AssetCard = styled(Card)`
  box-shadow: ${tokens.elevation.raised};
`

const AssetCardTitle = styled(Card.HeaderTitle)`
  font-weight: ${tokens.typography.paragraph.body_short_bold.fontWeight};
  margin: 0;
`

const Frontpage: NextPage = () => {
  const [popularDataProducts, setPopularDataProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/collibra/navigation/most_viewed?limit=6")
        const data = await res.json()
        console.log(data)
        setPopularDataProducts(data.results)
      } catch (error) {
        console.error("[Frontpage] Error while fetching most viewed data products", error)
      }
    })()

    return () => setPopularDataProducts([])
  }, [])

  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <Page>
      <SearchBarSection>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchBar placeholder={"Search\u2026"} name="search" onChange={handleSearchChange} />

          <TagsContainer>
            <Typography variant="body_short">
              Popular tags
            </Typography>

            <div>
              {/* TODO: filter out N unique tags from popular assets */}
              <Tag>Lorem</Tag>
              <Tag>Ipsum dolor</Tag>
              <Tag>Sit amet</Tag>
              <Tag>Consectetur</Tag>
            </div>
          </TagsContainer>
        </SearchForm>
      </SearchBarSection>

      <Section>
        <SectionHeader>
          <Typography variant="h1_bold">Popular</Typography>
          <Link href="/" passHref>
            <Typography variant="body_short" link>See more</Typography>
          </Link>
        </SectionHeader>

        <GridContainer>
          {popularDataProducts.length > 0 && popularDataProducts.map((product) => (
            <AssetCard key={product.id}>
              <Card.Header>
                <AssetCardTitle as="p">{product.name}</AssetCardTitle>
              </Card.Header>

              <Card.Content>
                <Typography variant="meta">
                  {fmtNumber(product.numberOfViews)}
                  {" "}
                  views
                </Typography>
              </Card.Content>
            </AssetCard>
          ))}
        </GridContainer>
      </Section>
    </Page>
  )
}

export default Frontpage
