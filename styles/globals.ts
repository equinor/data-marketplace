import { tokens } from "@equinor/eds-tokens"
import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
  font-family: Equinor, sans-serif;
}

a {
  color: ${tokens.colors.interactive.primary__resting.hex};

}

* {
  box-sizing: border-box;
}

:root {
  --layout-padding-inline: ${tokens.spacings.comfortable.medium};
  --layout-padding-block: ${tokens.spacings.comfortable.x_large};
  --layout-max-width: none;
  --highlight-colour: ${tokens.colors.infographic.primary__moss_green_13.hex};

  @media screen and (min-width: 768px) {
    --layout-padding-inline: ${tokens.spacings.comfortable.large};
    --layout-padding-block: ${tokens.spacings.comfortable.xx_large};
  }

  @media screen and (min-width: 992px) {
    --layout-padding-inline: ${tokens.spacings.comfortable.x_large};
    --layout-padding-block: ${tokens.spacings.comfortable.xxx_large};
    --layout-max-width: 70rem;
  }

  @media screen and (min-width: 1200px) {
    --layout-padding-inline: 4rem;
    --layout-padding-block: 5rem;
    --layout-max-width: 80rem;
  }
}
`
