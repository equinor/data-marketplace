/* eslint-disable camelcase */

import { info_circle } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage, GetServerSideProps } from "next"
import NextLink from "next/link"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Banner } from "components/Banner"
import { BrowseSpecificBusinessArea } from "components/BrowseSpecificBusinessArea"
import { Page } from "components/Page"
import { RelevantDataInformation } from "components/RelevantDataInformation"
import { Section } from "components/Section"
import { Heading } from "components/Typography"

const SearchButtonContainer = styled.div`
  grid-column: 3/4;
  grid-row: 4/5;
  justify-self: center;
`

const SearchButton = styled(NextLink)`
  --background: ${tokens.colors.interactive.primary__resting.hex};
  display: inline-block;
  text-decoration: none;
  color: ${tokens.colors.text.static_icons__primary_white.hex};
  background-color: var(--background);
  padding: var(--space-16) var(--space-64);
  font-size: ${tokens.typography.heading.h4.fontSize};
  border-radius: var(--space-4);

  &:hover {
    --background: ${tokens.colors.interactive.primary__hover.hex};
  }

  &:focus-visible {
    outline: 2px dashed ${tokens.colors.interactive.primary__resting.hex};
  }

  @media screen and (min-width: 350px) {
    padding: var(--space-16) 6rem;
  }
`

const Hero = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: var(--space-16) 1fr minmax(auto, 495px) 1fr var(--space-16);
  grid-template-rows: 5.5rem min-content var(--space-64) min-content var(--space-32) auto var(--space-16);
  min-height: 450px;
  background-image: url("/images/frontpageBg.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-color: #ffdaa8;
`

const MainHeading = styled(Heading)`
  grid-column: 3/4;
  grid-row: 2/3;
`
const InfoBanner = styled.div`
  grid-column: 3/4;
  grid-row: 6/7;
  justify-self: center;
  max-width: 17rem;
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
        <Hero>
          <MainHeading level="h1" size="2xl" center>
            {intl.formatMessage({ id: "frontpage.hero.title" })}
          </MainHeading>

          <SearchButtonContainer>
            {/* @ts-ignore */}
            <SearchButton href={USE_IMPROVED_SEARCH ? "/search-beta" : "/search"}>
              <FormattedMessage id="frontpage.c2a.title" />
            </SearchButton>
          </SearchButtonContainer>
          <InfoBanner>
            <Banner icon={info_circle} variant="none">
              {intl.formatMessage({ id: "frontpage.disclaimer" })}
            </Banner>
          </InfoBanner>
        </Hero>

        {USE_IMPROVED_SEARCH && (
          <Section highlight>
            <BrowseSpecificBusinessArea />
          </Section>
        )}
        <Section highlight>
          <RelevantDataInformation />
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
