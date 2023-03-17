import { Button } from "@equinor/eds-core-react"
import React from "react"
import { useClearRefinements, UseClearRefinementsProps } from "react-instantsearch-hooks-web"
import { useIntl } from "react-intl"
import styled from "styled-components"

const ClearButton = styled(Button)`
  color: var(--charcoal);
  background: var(--moss-green-13);
  font-weight: 1.2em;
  flex-direction: row;

  --eds_button__radius: 15px;
  :hover {
    color: var(--charcoal);
    background-color: var(--baby-blue);
  }
  :disabled {
    color: var(--disabled-clearRefinement);
    background: var(--moss-green-13);
  }
`

export const CustomClearRefinement = (props: UseClearRefinementsProps) => {
  const { canRefine, refine } = useClearRefinements(props)
  const intl = useIntl()
  if (canRefine) {
    return (
      <ClearButton variant="ghost" onClick={refine}>
        {intl.formatMessage({ id: "search.filter.clear" })}
      </ClearButton>
    )
  }
  return (
    <ClearButton variant="ghost" disabled onClick={refine}>
      {intl.formatMessage({ id: "search.filter.clear" })}
    </ClearButton>
  )
}
