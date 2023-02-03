/* eslint-disable camelcase */
import { Card, Typography, CircularProgress, Banner, Icon } from "@equinor/eds-core-react"
import { info_circle } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage, GetServerSideProps } from "next"
import NextLink from "next/link"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Page } from "components/Page"
import { Section } from "components/Section"
import { Illustration } from "components/frontpage"
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
const StyledLink = styled(NextLink)`
  text-decoration: none;
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
  @media (min-width: 35rem) {
    grid-template-areas: "hero";
    align-items: center;
    > * {
      grid-area: hero;
    }
  }
`

const HeroContent = styled.div`
  z-index: 1;
  align-self: start;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: ${tokens.shape.corners.borderRadius};
  padding: 0.5rem 0.5rem 0.5rem 0;
  @media (min-width: 35rem) {
    width: clamp(25ch, 50%, 600px);
    align-self: auto;
  }
`

const HeroIllustration = styled(Illustration)`
  width: clamp(350px, 50%, 600px);
  justify-self: center;
  @media (min-width: 35rem) {
    justify-self: end;
    align-self: end;
  }
`

type Props = {
  featureFlags: {
    USE_IMPROVED_SEARCH: string
  }
}

const Frontpage: NextPage<Props> = ({ featureFlags = { USE_IMPROVED_SEARCH: "false" } }) => {
  const intl = useIntl()
  const { popularDataProducts, isLoading, error } = usePopularProducts()
  const { USE_IMPROVED_SEARCH } = featureFlags

  if (error) {
    /* eslint-disable no-console */
    console.warn("[Frontpage] Failed while fetching most viewed data products", error)
  }

  return (
    <Page documentTitle={intl.formatMessage({ id: "common.documentTitle" })} useImprovedSearch={USE_IMPROVED_SEARCH}>
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
                <StyledLink
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
                              numberOfViews: fmtNumber(product.views),
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
                </StyledLink>
              ))}
            </GridContainer>
          )}
        </Section>
      </main>
    </Page>
  )
}

export default Frontpage

export const getServerSideProps: GetServerSideProps = async () => {
  const { USE_IMPROVED_SEARCH = "false" } = process.env

  return {
    props: {
      featureFlags: {
        USE_IMPROVED_SEARCH,
      },
    },
  }
}
