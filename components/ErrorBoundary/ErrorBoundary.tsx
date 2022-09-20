import { Typography } from "@equinor/eds-core-react"

import { Section } from "../Section"

import { GlobalStyle } from "styles/globals"

export const ErrorBoundary = () => (
  <>
    <GlobalStyle />
    <Section>
      <Typography variant="h1" style={{ marginBottom: "0.83em" }}>Something went wrong</Typography>
      <Typography style={{ maxWidth: "30rem" }} variant="body_long">
        The application detected an error that prevented it from loading.
        This error has been automatically reported
        to the development team.
      </Typography>
    </Section>
  </>

)
