import { tokens } from "@equinor/eds-tokens"
import { createGlobalStyle } from "styled-components"

export const elevations = {
  small: `
    0.5px 1px 1px hsl(var(--shadow-color) / 0.7)
  `,
  medium: `
    1px 2px 2px hsl(var(--shadow-color) / 0.333),
    2px 4px 4px hsl(var(--shadow-color) / 0.333),
    3px 6px 6px hsl(var(--shadow-color) / 0.333)
  `,
  large: `
    1px 2px 2px hsl(var(--shadow-color) / 0.2),
    2px 4px 4px hsl(var(--shadow-color) / 0.2),
    4px 8px 8px hsl(var(--shadow-color) / 0.2),
    8px 16px 16px hsl(var(--shadow-color) / 0.2),
    16px 32px 32px hsl(var(--shadow-color) / 0.2)
  `,
}

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
  


  /* Spaces */
  --space-2:  ${tokens.spacings.comfortable.xx_small};
  --space-4:  ${tokens.spacings.comfortable.x_small};
  --space-8:  ${tokens.spacings.comfortable.small};
  --space-12:  ${tokens.spacings.comfortable.medium_small};
  --space-16:  ${tokens.spacings.comfortable.medium};
  --space-24:  ${tokens.spacings.comfortable.large};
  --space-32:  ${tokens.spacings.comfortable.x_large};
  --space-40:  ${tokens.spacings.comfortable.xx_large};
  --space-48:  ${tokens.spacings.comfortable.xxx_large};
  --space-64:  4rem;

  /* Typography sizes*/
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.875rem; /* 14px */
  --text-base: 1rem; /* 16px */
  --text-lg: 1.25rem; /* 20px */
  --text-xl: 1.5rem; /* 24px */
  --text-2xl: 2rem; /* 32px */

  /* Colours */
  --disappointing-vanilla: hsla(34.5,100%,82.9%, 1);
  --moss-green-13: ${tokens.colors.infographic.primary__moss_green_13.hsla};


  /* Semantic colours */
  --highlight-colour: var(--moss-green-13);
  --frontpage-top-bg: var(--disappointing-vanilla);
  --shadow-color: 0deg 0% 50%;

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
