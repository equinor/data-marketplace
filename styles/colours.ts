import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`

:root {
  --moss-green-100: hsla(184,100%,23.7%,1);
  --outline-relevant-data-info: hsla(184,100%,23.7%,1);
  --moss-dark: hsla(184,100%,16.7%,1);
  --moss-green-13: hsla(184,32%,90.2%,1);
  
  --slate-blue: hsla(206,32.1%,20.8%,1);
  
  --danger: hsla(0,100%,87.8%,1);
  --warning-icon-bg: hsla(346,100%,46.1%,1);
  --warning-icon-fill: hsla(34,100%,33.9%,1);
  --validation-error:  hsla(348,86.5%,37.6%,1);
  --highlight-match: hsla(0,100%,46.1%,1);
  
  --medium-grey: hsla(0,0%,86.3%,1);
 
  
  --image-placeholder-icon: hsla(0,0%,0%,0.4);
  --warning: hsla(25,100%,92%,1);

  --current-pagination: hsla(208,34.3%,13.7%,1);
  --disabled-pagination: hsla(0,0%,74.5%,1);

  --disabled-clear-refinement: hsla(0,0%,43.5%,1);
  
  --disappointing-vanilla: hsla(34.5,100%,82.9%, 1);

  --white: hsla(0,0%,100%,1);
  --default: hsla(0,0%,100%,1);
  --top-bar-bottom: hsla(0,0%,100%,1);
 
  --baby-blue: hsl(199, 33%, 80%);
  --info: hsla(199,58.5%,89.6%,1);

  --charcoal: hsla(0,0%,23.9%,1);
  --disabled-text: hsla(0,0%,23.9%,1);
  --default-text: hsla(0,0%,23.9%,1);

}

`

/*
 
  --moss-green-13: ${tokens.colors.infographic.primary__moss_green_13.hsla}; 
  --moss-green-100: ${tokens.colors.infographic.primary__moss_green_100.hsla};
  --slateBlue: ${tokens.colors.infographic.primary__slate_blue.hsla};
  
  --danger: ${tokens.colors.ui.background__danger.hsla};
  --default: ${tokens.colors.ui.background__default.hsla};
  --mediumGrey: ${tokens.colors.ui.background__medium.hsla};
  --info: ${tokens.colors.ui.background__info.hsla};
  --topBarBottom: ${tokens.colors.ui.background__default.hsla};
  --imagePlaceholderIcon: ${tokens.colors.ui.background__scrim.hsla};
  
  --warning: ${tokens.colors.interactive.warning__highlight.hsla};
  --warning-icon-fill: ${tokens.colors.interactive.warning__text.hsla};
  --validationError: ${tokens.colors.interactive.danger__text.hsla};
  --highlightMatch: ${tokens.colors.interactive.danger__resting.hsla};
  --currentPagination: ${tokens.colors.interactive.secondary__link_hover.hsla};
  --disabledPagination: ${tokens.colors.interactive.disabled__text.hsla};
  --outlineRelevantDataInfo: ${tokens.colors.interactive.primary__resting.hsla};

  
  --warning-icon-bg: ${tokens.colors.logo.fill_positive.hsla};

  --disabled-text: ${tokens.colors.text.static_icons__default.hsla};
  --defaultText: ${tokens.colors.text.static_icons__default.hsla};
  --disabled-clearRefinement: ${tokens.colors.text.static_icons__tertiary.hsla};
  */
