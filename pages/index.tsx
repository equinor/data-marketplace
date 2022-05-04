import { Card, Search, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react"
import styled from "styled-components"

import { Section } from "../components/Section"
import { fmtNumber } from "../lib/fmtNumber"

const SearchBarSection = styled(Section)`
  max-width: 42rem;
`

const SearchForm = styled.form`
  >:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`

const SearchBar = styled(Search)`
  @media screen and (min-width: 768px) {
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
        setPopularDataProducts(data.results)
      } catch (error) {
        console.error("[Frontpage] Error while fetching most viewed data products", error)
      }
    })()

    return () => setPopularDataProducts([])
  }, [])

  // TODO: filter out N unique tags
  const uniquePopularTags = useMemo(() => {
    if (!popularDataProducts) return []
    const tags = popularDataProducts
      .flatMap((product) => product.tags)
      .filter((tag, i, self) => self.findIndex((selfTag) => selfTag?.id === tag?.id) === i)
      .slice(0, 5)
    return tags
  }, [popularDataProducts])

  const handleSearchSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    router.push({
      pathname: "/search",
      query: {
        q: searchQuery,
      },
    })
  }

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchQuery(e.target.value)
  }

  return (
    <>
      <SearchBarSection>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchBar placeholder={"Search\u2026"} name="search" onChange={handleSearchChange} />

          {uniquePopularTags.length > 0 && (
            <TagsContainer>
              <Typography variant="body_short">
                Popular tags
              </Typography>

              <div>
                {uniquePopularTags.map((tag) => (
                  <Tag key={tag.id}>{tag.name}</Tag>
                ))}
              </div>
            </TagsContainer>
          )}
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
    </>
  )
}

export default Frontpage
