"use client"

/* eslint-disable camelcase */
import { info_circle } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import NextLink from "next/link"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Banner } from "components/Banner"
import { Heading } from "components/Typography"
import { elevations } from "styles/globals"

const StyledHero = styled.div`
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

export const Hero = () => {
  const intl = useIntl()
  return (
    <StyledHero>
      <MainHeading level="h1" size="2xl" center>
        {intl.formatMessage({ id: "frontpage.hero.title" })}
      </MainHeading>
      <SearchButton href="/search">
        <FormattedMessage id="frontpage.c2a.title" />
      </SearchButton>
      <InfoBanner>
        <Banner icon={info_circle} variant="none">
          {intl.formatMessage({ id: "frontpage.disclaimer" })}
        </Banner>
      </InfoBanner>
    </StyledHero>
  )
}
