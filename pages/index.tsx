/* eslint-disable camelcase */
import { Icon } from "@equinor/eds-core-react"
import { info_circle, search } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage, GetServerSideProps } from "next"
import NextLink from "next/link"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Banner } from "components/Banner"
import { BrowseSpecificBusinessArea } from "components/BrowseSpecificBusinessArea"
import { Page } from "components/Page"
import { RelevantDataInformation } from "components/RelevantDataInformation"
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

const Hero = styled.div`
  display: grid;
  width: 100%;
  grid-template: "hero";
  place-items: center;
  place-content: center;
  min-height: 450px;
  background-image: url("/images/frontpageBg.svg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-color: #ffdaa8;
`

const HeroContent = styled.div`
  grid-area: hero;
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

            <Banner icon={info_circle} variant="none">
              {intl.formatMessage({ id: "frontpage.disclaimer" })}
            </Banner>
          </HeroContent>
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
