import { Card, Search, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import Head from "next/head"
import { useRouter } from "next/router"
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Container } from "../components/Container"
import { Link } from "../components/Link"
import { Section } from "../components/Section"
import { Illustration } from "../components/frontpage"
import { HttpClient } from "../lib/HttpClient"
import { fmtNumber } from "../lib/fmtNumber"

const SearchBarSection = styled(Section)`
  max-width: 42rem;
  margin: 0 auto;
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
  color: ${tokens.colors.text.static_icons__default.hex};
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
`

const Hero = styled.section``

const HeroContent = styled.div``

const Frontpage: NextPage = () => {
  const intl = useIntl()
  const [popularDataProducts, setPopularDataProducts] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState<string>("")

  const router = useRouter()

  useEffect(() => {
    (async () => {
      try {
        const res = await HttpClient.get("/api/popular", {
          headers: { authorization: `Bearer ${window.localStorage.getItem("access_token")}` },
          query: { limit: 6 },
        })
        setPopularDataProducts(res.body)
      } catch (error) {
        console.error("[Frontpage] Error while fetching most viewed data products", error)
      }
    })()

    return () => setPopularDataProducts([])
  }, [])

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

  const documentTitle = intl.formatMessage({ id: "common.documentTitle" })

  return (
    <Container>
      <Head>
        <title>
          {documentTitle}
        </title>
      </Head>
      <Hero>

        <HeroContent>
          <Typography variant="h1_bold">{intl.formatMessage({ id: "frontpage.hero.title" })}</Typography>
          <Typography variant="ingress">{intl.formatMessage({ id: "frontpage.hero.ingress" })}</Typography>

        </HeroContent>
        <Illustration />

      </Hero>
      <SearchBarSection>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchBar placeholder={intl.formatMessage({ id: "frontpage.placeholderSearch" })} name="search" onChange={handleSearchChange} />

          {/* TODO: Get communities */}
        </SearchForm>
      </SearchBarSection>

      <Section>
        <SectionHeader>
          <Typography variant="h2">
            <FormattedMessage id="frontpage.popularProductsHeader" />
          </Typography>
        </SectionHeader>

        <GridContainer>
          {popularDataProducts.length > 0 && popularDataProducts.map((product) => (
            <AssetCard key={product.id}>
              <Link
                href={{
                  pathname: "/assets/[id]",
                  query: { id: product.id },
                }}
                title={product.name}
              >
                <Card.Header>
                  <AssetCardTitle as="p">{product.name}</AssetCardTitle>
                </Card.Header>
                <Card.Content>
                  <Typography variant="meta">
                    <FormattedMessage
                      id="frontpage.numberOfViews"
                      values={{
                        numberOfViews: fmtNumber(product.numberOfViews),
                      }}
                    />
                  </Typography>
                </Card.Content>
              </Link>
            </AssetCard>
          ))}
        </GridContainer>
      </Section>
    </Container>
  )
}

export default Frontpage
