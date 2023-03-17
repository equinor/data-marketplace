"use client"

import { tokens } from "@equinor/eds-tokens"
import { createGlobalStyle } from "styled-components"

export const elevations = {
  small: `
    0.5px 1px 1px hsl(var(--shadow-colour) / 0.7)
  `,
  medium: `
    1px 2px 2px hsl(var(--shadow-colour) / 0.333),
    2px 4px 4px hsl(var(--shadow-colour) / 0.333),
    3px 6px 6px hsl(var(--shadow-colour) / 0.333)
  `,
  large: `
    1px 2px 2px hsl(var(--shadow-colour) / 0.2),
    2px 4px 4px hsl(var(--shadow-colour) / 0.2),
    4px 8px 8px hsl(var(--shadow-colour) / 0.2),
    8px 16px 16px hsl(var(--shadow-colour) / 0.2),
    16px 32px 32px hsl(var(--shadow-colour) / 0.2)
  `,
}

export const GlobalStyle = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
}

a {
  color: ${tokens.colors.interactive.primary__resting.hex};
}

* {
  box-sizing: border-box;
}

:root {
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
  --moss-green-100: ${tokens.colors.interactive.primary__resting.hsla};
  --white: ${tokens.colors.ui.background__default.hsla};
  --moss-dark: ${tokens.colors.interactive.primary__hover.hsla};
  --baby-blue: 	hsl(199, 33%, 80%);
  --charcoal: ${tokens.colors.text.static_icons__default.hsla};
  --medium-grey: ${tokens.colors.ui.background__medium.hsla};
  --slateBlue: ${tokens.colors.infographic.primary__slate_blue.hsla};
  --background-light: ${tokens.colors.ui.background__light.rgba};

  --validation-error: ${tokens.colors.interactive.danger__text.hsla};
  --danger: ${tokens.colors.ui.background__danger.hsla};
  --default: ${tokens.colors.ui.background__default.hsla};

  --warning: ${tokens.colors.interactive.warning__highlight.hsla};
  --transparent-black: hsla(0, 0%, 0%, 0.14);
  --warning-icon-background: ${tokens.colors.logo.fill_negative.hex};
  --warning-icon-fill: ${tokens.colors.interactive.warning__text.hsla};

  --disabled-text: var(---charcoal);
  /* Semantic colours 
  This doesn't actually work very well... We should probably wait for EDS
  */
  --highlight-colour: var(--moss-green-13);
  --frontpage-top-bg: var(--disappointing-vanilla);
  --shadow-colour: 0deg 0% 50%;
  --dark-button-colour: var(--moss-green-100);
  --dark-button-colour-hover: var(--moss-dark);
  --outline-colour: var(--moss-green-100);
  --hit-highlight: hsla(185, 30%, 84%, 1);


  --layout-padding-inline: ${tokens.spacings.comfortable.medium};  /*  16px */
  --layout-padding-block: ${tokens.spacings.comfortable.x_large};  /* 32px */
  --layout-max-width: none;

  @media screen and (min-width: 768px) {
    --layout-padding-inline: ${tokens.spacings.comfortable.large}; /* 24px */
    --layout-padding-block: ${tokens.spacings.comfortable.xx_large}; /* 40px */
  }

  @media screen and (min-width: 992px) {
    --layout-padding-inline: ${tokens.spacings.comfortable.x_large}; /* 32px */
    --layout-padding-block: ${tokens.spacings.comfortable.xxx_large}; /* 48px */
    --layout-max-width: 70rem;
  }

  @media screen and (min-width: 1200px) {
    --layout-padding-inline: 7.75rem; /* 124px */
    --layout-padding-block: 5rem;
    --layout-max-width: 94.5rem; /* 1512 */
  }
}
`
