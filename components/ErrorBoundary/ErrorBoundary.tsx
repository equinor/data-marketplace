import { Typography } from "@equinor/eds-core-react"

import { Section } from "../Section"

import { Heading } from "components/Typography"
import { GlobalStyle } from "styles/globals"

export const ErrorBoundary = () => (
  <>
    <GlobalStyle />
    <Section>
      <Heading level="h1" size="2xl" style={{ marginBottom: "0.83em" }}>
        Something went wrong
      </Heading>
      <Typography style={{ maxWidth: "30rem" }} variant="body_long">
        The application detected an error that prevented it from loading. This error has been automatically reported to
        the development team.
      </Typography>
    </Section>
  </>
)
