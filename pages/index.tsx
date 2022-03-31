import { Card, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"
import styled from "styled-components"

import { Page } from "../components/Page"
import { fmtNumber } from "../lib/fmtNumber"

const Section = styled.section`
  width: 100%;
  padding: 0 5rem;
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

  return (
    <Page>
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
