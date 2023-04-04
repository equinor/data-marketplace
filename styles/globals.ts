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
  color: var(---moss-green-100);
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
  --disappointing-vanilla: hsla(34.5,100%,82.9%, 1); /* Not an EDS colour */

  --moss-green-13: hsla(184,32%,90.2%,1); /* tokens.colors.infographic_primary__moss_green_13.hsla */
  --moss-green-100: hsla(184,100%,23.7%,1); /* tokens.colors.interactive.primary__resting.hsla */
  --moss-dark: hsla(184,100%,16.7%,1); /* tokens.colors.interactive.primary__hover.hsla */
  --baby-blue: 	hsl(199, 33%, 80%); /* not an EDS colour */
  --dusty-blue: hsla(185, 30%, 84%, 1); /* not an EDS colour */
  --slateBlue: hsla(206,32.1%,20.8%,1); /* tokens.colors.infographic.primary__slate_blue.hsla */

  --white: hsla(0,0%,100%,1); /* tokens.colors.ui.background__default.hsla */
 
  --light-grey: hsla(0,0%,75%, 1); /* tokens.colors.interactive.disabled__text.hsla */
  --medium-grey: hsla(0,0%,86.3%,1); /* tokens.colors.ui.background__medium.hsla */
  --dark-grey: hsla(0,0%,43.5%,1); /* tokens.colors.text.static_icons__tertiary.hsla */
  --charcoal: hsla(0,0%,23.9%,1); /*tokens.colors.text.static_icons__default.hsla */
  
  --validation-error: hsla(348,86.5%,37.6%,1); /* tokens.colors.interactive.danger__text.hsla */ 
  --danger: hsla(0,100%,87.8%,1); /* tokens.colors.ui.background__danger.hsla */
  --warning: hsla(25,100%,92%,1); /* tokens.colors.interactive.warning__highlight.hsla */
  --transparent-black: hsla(0, 0%, 0%, 0.14); /* Not an EDS colour */
  --warning-icon-fill: hsla(34,100%,33.9%,1); /* tokens.colors.interactive.warning__text.hsla */



  --shadow-colour: 0deg 0% 50%;
  --outline-colour: var(--moss-green-100);
  
  /*  Main page layout spacings  */
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
