import { List, Checkbox, EdsProvider, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useRefinementList, UseRefinementListProps } from "react-instantsearch-hooks-web"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { Heading } from "components/Typography"

export type RefinementListProps = React.PropsWithChildren & UseRefinementListProps

const { Item } = List

const NoRelevant = styled.span`
  padding: var(--space-small) 0;
  display: inline-block;
  padding: var(--space-small) var(--space-large);
`

const FilterContainer = styled.div`
  grid-area: filter;
`

const StyledCheckbox = styled(Checkbox)`
  /* Not an EDS colour */
  --eds_interactive_primary__hover_alt: rgba(186, 209, 220, 1);
`

const StyledList = styled(List)`
  padding: 0;
  list-style-type: none;
`

const StyledItem = styled(Item)`
  padding-left: var(--space-small);
`
export const RefinementList = ({ children, ...rest }: RefinementListProps) => {
  const { items, refine } = useRefinementList({ ...rest })
  return (
    <div>
      <EdsProvider density="compact">
        <FilterContainer>
          <Heading level="h4" size="base" style={{ marginBlock: "1rem 0.25rem", fontWeight: 500 }}>
            {children}
          </Heading>
          {items.length > 0 ? (
            <StyledList>
              {items.map((item) => (
                <StyledItem key={item.value}>
                  <StyledCheckbox
                    value={item.value}
                    label={`${item.label} (${item.count})`}
                    checked={item.isRefined}
                    onChange={() => refine(item.value)}
                  />
                </StyledItem>
              ))}
            </StyledList>
          ) : (
            <NoRelevant>
              <Typography
                group="paragraph"
                variant="meta"
                weight="regular"
                style={{ fontSize: "14px" }}
                color={tokens.colors.text.static_icons__tertiary.hex}
              >
                <FormattedMessage id="asset.no.relevant.filters" defaultMessage="No assets for this filter" />
              </Typography>
            </NoRelevant>
          )}
        </FilterContainer>
      </EdsProvider>
    </div>
  )
}