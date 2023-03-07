/* eslint-disable camelcase */

import { info_circle } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage, GetServerSideProps } from "next"
import NextLink from "next/link"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Banner } from "components/Banner"
import { BrowseSpecificBusinessArea } from "components/BrowseSpecificBusinessArea"
import { Container } from "components/Container"
import { Page } from "components/Page"
import { RelevantDataInformation } from "components/RelevantDataInformation"
import { Heading } from "components/Typography"
import { elevations } from "styles/globals"

const SearchButton = styled(NextLink)`
  --shadow-colour: 184deg 60% 10%;
  grid-column: 3/4;
  grid-row: 4/5;
  justify-self: center;

  display: inline-block;
  text-decoration: none;
  color: var(--white);
  background-color: var(--dark-button-colour);
  padding: var(--space-16) var(--space-64);
  font-size: ${tokens.typography.heading.h4.fontSize};
  border-radius: var(--space-4);
  box-shadow: ${elevations.medium};
  &:hover {
    background-color: var(--dark-button-colour-hover);
  }

  &:focus-visible {
    outline: 2px dashed var(--outline-colour);
    outline-offset: 4px;
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
  min-height: 480px;
  background-image: url("/images/frontpageBg.svg");
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
  background-color: var(--frontpage-top-bg);
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
  algoliaIndexName: string
}

const Frontpage: NextPage<Props> = ({ algoliaIndexName }) => {
  const intl = useIntl()

  return (
    <Page documentTitle={intl.formatMessage({ id: "common.documentTitle" })}>
      <main>
        <Hero>
          <MainHeading level="h1" size="2xl" center>
            {intl.formatMessage({ id: "frontpage.hero.title" })}
          </MainHeading>
          <SearchButton href="/search-beta">
            <FormattedMessage id="frontpage.c2a.title" />
          </SearchButton>
          <InfoBanner>
            <Banner icon={info_circle} variant="none">
              {intl.formatMessage({ id: "frontpage.disclaimer" })}
            </Banner>
          </InfoBanner>
        </Hero>

        <Container highlight>
          <BrowseSpecificBusinessArea indexName={algoliaIndexName} />
        </Container>

        <Container highlight>
          <RelevantDataInformation />
        </Container>
      </main>
    </Page>
  )
}

export default Frontpage

export const getServerSideProps: GetServerSideProps = async () => {
  const indexName = process.env.ALGOLIA_SEARCH_INDEX ?? ""

  if (indexName === "") {
    console.log("Missing the Algolia search index name")
  }

  return {
    props: {
      algoliaIndexName: indexName,
    },
  }
}
