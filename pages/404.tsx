/* eslint-disable camelcase */
import {
  Typography,
} from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import {
  ReactNode,
  useCallback,
} from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Illustration } from "components/NotFound"
import { Page } from "components/Page"
import { Section } from "components/Section"

const Hero = styled.div`
  display: grid;
  grid-template-areas: "hero";
  min-height: 35rem;
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

const HeroIllustration = styled(Illustration)`
  width: clamp(500px, 40%, 500px);
  justify-self: end;
`

const PageNotFound: NextPage = () => {
  const intl = useIntl()

  const FormattedLink = useCallback((chunks: ReactNode[]) => (
    <Typography
      link
      href="/"
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {chunks}
    </Typography>
  ), [])

  return (
    <Page>
      <main>
        <Section>
          <Hero>
            <HeroContent>
              <Typography variant="meta">
                {intl.formatMessage({ id: "notfound.code.number" })}
              </Typography>

              <Typography variant="h1" style={{ marginBottom: "0.67em" }} bold>
                {intl.formatMessage({ id: "notfound.hero.title" })}
              </Typography>
              <Typography style={{ marginBottom: tokens.spacings.comfortable.x_large }} variant="ingress">
                <FormattedMessage
                  id="notfound.hero.ingress"
                  values={{
                    a: FormattedLink,
                    here: "here",
                  }}
                />

              </Typography>
            </HeroContent>
            <HeroIllustration />
          </Hero>
        </Section>
      </main>
    </Page>
  )
}

export default PageNotFound
