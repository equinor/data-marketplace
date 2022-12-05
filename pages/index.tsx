/* eslint-disable camelcase */
import { Card, Typography, CircularProgress, Banner, Icon } from "@equinor/eds-core-react"
import { info_circle } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Link } from "components/Link"
import { Page } from "components/Page"
import { Section } from "components/Section"
import { EquinorIllustration } from "components/frontpage"
import { usePopularProducts } from "hooks"
import { fmtNumber } from "lib/fmtNumber"

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

const InfoIcon = styled(Banner.Icon)`
  @media screen and (max-width: 550px) {
    display: none;
  }
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 28ch), 1fr));
  grid-gap: 1.5rem;
`

const Views = styled(Typography)`
  justify-self: end;
`

const Hero = styled.div`
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

const HeroIllustration = styled(EquinorIllustration)`
  width: clamp(300px, 40%, 500px);
  justify-self: end;
`

const Frontpage: NextPage = () => {
  const intl = useIntl()
  const { popularDataProducts, isLoading, error } = usePopularProducts()

  if (error) {
    console.warn("[Frontpage] Failed while fetching most viewed data products", error)
  }

  return (
    <Page>
      <main>
        <Section>
          <Hero>
            <HeroContent>
              <Typography variant="h1" style={{ marginBottom: "0.67em" }} bold>
                {intl.formatMessage({ id: "frontpage.hero.title" })}
              </Typography>
              <Typography style={{ marginBottom: tokens.spacings.comfortable.x_large }} variant="ingress">
                {intl.formatMessage({ id: "frontpage.hero.ingress" })}
              </Typography>
              <Banner>
                <InfoIcon>
                  <Icon data={info_circle} />
                </InfoIcon>
                <Banner.Message>{intl.formatMessage({ id: "frontpage.disclaimer" })}</Banner.Message>
              </Banner>
            </HeroContent>
            <HeroIllustration />
          </Hero>
        </Section>
        <Section highlight>
          <SectionHeader>
            <Typography variant="h2">
              <FormattedMessage id="frontpage.popularProductsHeader" />
            </Typography>
          </SectionHeader>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <GridContainer>
              {popularDataProducts.map((product) => (
                <Link
                  key={product.id}
                  href={{ pathname: "/assets/[id]", query: { id: product.id } }}
                  title={product.name}
                >
                  <CardGrid elevation="raised">
                    <Card.Header>
                      <Card.HeaderTitle>
                        <Views variant="meta">
                          <FormattedMessage
                            id="frontpage.numberOfViews"
                            values={{
                              numberOfViews: fmtNumber(product.numberOfViews),
                            }}
                          />
                        </Views>
                        <Typography variant="h5" as="h3" lines={2}>
                          {product.name}
                        </Typography>
                      </Card.HeaderTitle>
                    </Card.Header>
                    <Card.Content />
                  </CardGrid>
                </Link>
              ))}
            </GridContainer>
          )}
        </Section>
      </main>
    </Page>
  )
}

export default Frontpage
