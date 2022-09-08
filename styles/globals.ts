import { tokens } from "@equinor/eds-tokens"
import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  font-family: Equinor, sans-serif;
  
}

#__next {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

:root {
  --layout-padding-inline: ${tokens.spacings.comfortable.medium};
  --layout-max-width: none;

  @media screen and (min-width: 768px) {
    --layout-padding-inline: ${tokens.spacings.comfortable.large};
  }

  @media screen and (min-width: 992px) {
    --layout-padding-inline: ${tokens.spacings.comfortable.x_large};
    --layout-max-width: 70rem;
  }

  @media screen and (min-width: 1200px) {
    --layout-padding-inline: 4rem;
    --layout-max-width: 80rem;
  }
}
`
