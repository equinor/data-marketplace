/* eslint-disable camelcase */
import { Icon } from "@equinor/eds-core-react"
import { info_circle, search } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage, GetServerSideProps } from "next"
import NextLink from "next/link"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Banner } from "components/Banner"
import { Page } from "components/Page"
import { DataInformationCard } from "components/RelevantDataInformation"
import { Section } from "components/Section"
import { Heading } from "components/Typography"

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

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 28ch), 1fr));
  grid-gap: 1rem;
`

const StyledLink = styled.a`
  text-decoration: none;
  &:focus-visible {
    outline: 2px dashed ${tokens.colors.interactive.primary__resting.hex};
  }
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
  const { USE_IMPROVED_SEARCH } = featureFlags

  return (
    <Page documentTitle={intl.formatMessage({ id: "common.documentTitle" })} useImprovedSearch={USE_IMPROVED_SEARCH}>
      <main>
        <Section>
          <Hero>
            <HeroContent>
              <Heading level="h1" size="2xl" center style={{ marginBottom: "3rem" }} bold>
                {intl.formatMessage({ id: "frontpage.hero.title" })}
              </Heading>

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
          <Heading level="h3" size="xl" style={{ marginBottom: tokens.spacings.comfortable.large }}>
            <FormattedMessage id="frontpage.relevantdatainfo.header" />
          </Heading>

          <GridContainer>
            <StyledLink href="https://statoilsrm.sharepoint.com/sites/Datatomany" target="_blank">
              <DataInformationCard
                header={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.tomany.title" })}
                content={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.tomany.text" })}
              />
            </StyledLink>
            <StyledLink href="https://statoilsrm.sharepoint.com/sites/Dataanalyticsnetwork" target="_blank">
              <DataInformationCard
                header={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.analytics.title" })}
                content={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.analytics.text" })}
              />
            </StyledLink>
            <StyledLink
              href="https://statoilsrm.sharepoint.com/sites/EDM/SitePages/Data%20Product%20Playbook.aspx"
              target="_blank"
            >
              <DataInformationCard
                header={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.product.title" })}
                content={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.product.text" })}
              />
            </StyledLink>
          </GridContainer>
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
