import { Card, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import Head from "next/head"
import {
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

const CardGrid = styled(Card)`
justify-content: space-between;
  height: 100%;
`

const SectionHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.5rem;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15ch), 1fr));
  grid-gap: 1.5rem;
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

const Hero = styled(Section)`
  display: grid;
  grid-template-areas: "hero";
  min-height: 28rem;
  align-items: center;

   > * {
    grid-area: hero;
  }
`

const HeroContent = styled.div`
  width: clamp(25ch, 60%, 600px);
  z-index: 1;
  align-self: start; 
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: ${tokens.shape.corners.borderRadius};
  padding: 0.5rem 0.5rem 0.5rem 0;
  @media (min-width: 40rem) {
    align-self: auto;
  }
`

const HeroIllustration = styled(Illustration)`
  width: clamp(300px, 40%, 500px);
  justify-self: end;
`

const Frontpage: NextPage = () => {
  const intl = useIntl()
  const [popularDataProducts, setPopularDataProducts] = useState<any[]>([])

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

  const documentTitle = intl.formatMessage({ id: "common.documentTitle" })

  return (

    <main>
      <Container>
        <Head>
          <title>
            {documentTitle}
          </title>
        </Head>
        <Hero>
          <HeroContent>
            <Typography variant="h1" style={{ marginBottom: "0.67em" }} bold>
              {intl.formatMessage({ id: "frontpage.hero.title" })}
            </Typography>
            <Typography variant="ingress">{intl.formatMessage({ id: "frontpage.hero.ingress" })}</Typography>
          </HeroContent>
          <HeroIllustration />
        </Hero>

        <Section>
          <SectionHeader>
            <Typography variant="h2">
              <FormattedMessage id="frontpage.popularProductsHeader" />
            </Typography>
          </SectionHeader>

          <GridContainer>
            {popularDataProducts.length > 0 && popularDataProducts.map((product) => (
              <Link key={product.id} href={{ pathname: "/assets/[id]", query: { id: product.id } }} title={product.name}>
                <CardGrid elevation="raised">
                  <Card.Header>
                    <AssetCardTitle>
                      <Typography variant="h5" as="h2">
                        {product.name}
                      </Typography>
                    </AssetCardTitle>
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
                </CardGrid>
              </Link>
            ))}
          </GridContainer>
        </Section>
      </Container>
    </main>
  )
}

export default Frontpage
