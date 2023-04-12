/* eslint-disable camelcase */

import { Icon } from "@equinor/eds-core-react"
import { info_circle } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage, GetServerSideProps } from "next"
import NextLink from "next/link"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

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
  background-color: var(--moss-green-100);
  padding: var(--space-16) var(--space-64);
  font-size: ${tokens.typography.heading.h4.fontSize};
  border-radius: var(--space-4);
  box-shadow: ${elevations.medium};
  &:hover {
    background-color: var(--moss-dark);
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
  background-color: var(--disappointing-vanilla);
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

const Banner = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
  padding: 1rem;
  align-items: center;
  color: var(--charcoal);
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
          <SearchButton href="/search">
            <FormattedMessage id="frontpage.c2a.title" />
          </SearchButton>
          <InfoBanner>
            <Banner>
              <Icon data={info_circle} />
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
