import { Button } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import React from "react"
import { useClearRefinements, UseClearRefinementsProps } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"
import styled from "styled-components"

const ButtonNew = styled(Button)`
  color: ${tokens.colors.text.static_icons__default.hex};
  background: ${tokens.colors.infographic.primary__moss_green_13.hex};
  border-width: 0;
  font-weight: 14pt;
  padding-left: 8.15rem;
  :hover {
    color: ${tokens.colors.text.static_icons__default.hex};
    background: ${tokens.colors.infographic.primary__moss_green_13.hex};
    border-width: 0;
  }
`

const ButtonDisabled = styled(Button)`
  color: ${tokens.colors.text.static_icons__tertiary.hex};
  background: ${tokens.colors.infographic.primary__moss_green_13.hex};
  border-width: 0;
  font-weight: 14pt;
  padding-left: 8.15rem;
  :hover {
    color: ${tokens.colors.text.static_icons__tertiary.hex};
    background: ${tokens.colors.infographic.primary__moss_green_13.hex};
    border-width: 0;
  }
`

export const CustomClearRefinement = (props: UseClearRefinementsProps) => {
  const { canRefine, refine } = useClearRefinements(props)
  const intl = useIntl()
  if (canRefine) {
    return <ButtonNew onClick={refine}>{intl.formatMessage({ id: "improvedSearch.filter.clear" })}</ButtonNew>
  }
  return <ButtonDisabled onClick={refine}>{intl.formatMessage({ id: "improvedSearch.filter.clear" })}</ButtonDisabled>
}
