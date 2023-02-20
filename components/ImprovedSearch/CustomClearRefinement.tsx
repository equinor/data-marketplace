import { Button } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import React from "react"
import { useClearRefinements, UseClearRefinementsProps } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"
import styled from "styled-components"

const ClearButton = styled(Button)`
  color: ${tokens.colors.text.static_icons__default.hex};
  background: ${tokens.colors.infographic.primary__moss_green_13.hex};
  font-weight: 1.2em;
  flex-direction: row;
  :hover {
    color: ${tokens.colors.text.static_icons__default.hex};
    /* Not an EDS colour */
    background-color: rgba(186, 209, 220, 1);
  }
  :disabled {
    color: ${tokens.colors.text.static_icons__tertiary.hex};
    background: ${tokens.colors.infographic.primary__moss_green_13.hex};
  }
`

export const CustomClearRefinement = (props: UseClearRefinementsProps) => {
  const { canRefine, refine } = useClearRefinements(props)
  const intl = useIntl()
  if (canRefine) {
    return (
      <ClearButton variant="ghost" onClick={refine}>
        {intl.formatMessage({ id: "improvedSearch.filter.clear" })}
      </ClearButton>
    )
  }
  return (
    <ClearButton variant="ghost" disabled onClick={refine}>
      {intl.formatMessage({ id: "improvedSearch.filter.clear" })}
    </ClearButton>
  )
}
