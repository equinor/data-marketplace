/* eslint-disable camelcase */
import { Card, Typography, CircularProgress, Icon } from "@equinor/eds-core-react"
import { info_circle, search } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage, GetServerSideProps } from "next"
import NextLink from "next/link"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Banner } from "components/Banner"
import { Page } from "components/Page"
import { Section } from "components/Section"
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

const SearchButtonContainer = styled.div`
  margin-bottom: 3rem;
`

const SearchButton = styled(NextLink)`
  --background: ${tokens.colors.interactive.primary__resting.hex};

  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${tokens.colors.text.static_icons__primary_white.hex};
  background-color: var(--background);
  height: 3.5rem;
  padding: 0 3.5rem 0 3rem;
  font-size: ${tokens.typography.heading.h4.fontSize};
  border-radius: 0.25rem;

  &:hover {
    --background: ${tokens.colors.interactive.primary__hover.hex};
  }

  &:focus-visible {
    outline: 2px dashed ${tokens.colors.interactive.primary__resting.hex};
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
  display: flex;
  justify-content: center;
`

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 35rem) {
    width: clamp(25ch, 50%, 600px);
    align-self: auto;
  }
`

type Props = {
  featureFlags: {
    USE_IMPROVED_SEARCH: boolean
  }
}

const Frontpage: NextPage<Props> = ({ featureFlags = { USE_IMPROVED_SEARCH: false } }) => {
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
              <Typography variant="h1" style={{ marginBottom: "3rem", textAlign: "center" }} bold>
                {intl.formatMessage({ id: "frontpage.hero.title" })}
              </Typography>

              <SearchButtonContainer>
                {/* @ts-ignore */}
                <SearchButton href={USE_IMPROVED_SEARCH ? "/search-beta" : "/search"}>
                  <Icon data={search} />
                  Find data
                </SearchButton>
              </SearchButtonContainer>

              <Banner variant="warning" icon={info_circle}>
                {intl.formatMessage({ id: "frontpage.disclaimer" })}
              </Banner>
            </HeroContent>
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
  const USE_IMPROVED_SEARCH = process.env.USE_IMPROVED_SEARCH === "true"

  return {
    props: {
      featureFlags: {
        USE_IMPROVED_SEARCH,
      },
    },
  }
}
