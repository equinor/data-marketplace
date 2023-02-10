import { List, Checkbox, EdsProvider, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useRefinementList, UseRefinementListProps } from "react-instantsearch-hooks-web"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

export type RefinementListProps = React.ComponentProps<"div"> & UseRefinementListProps

const { Item } = List

const NoRelevant = styled.span`
  padding: var(--space-small) 0;
  display: inline-block;
  padding: var(--space-small) var(--space-large);
`
const StyledList = styled(List)`
  padding: 0;
  list-style-type: none;
`

const StyledItem = styled(Item)`
  padding-left: var(--space-small);
`
export const RefinementList = (props: RefinementListProps) => {
  const { items, refine } = useRefinementList(props)
  return (
    <div>
      {items.length > 0 ? (
        <EdsProvider density="compact">
          <Typography variant="h4" as="h2" style={{ marginBottom: "0.67rem" }}>
            <FormattedMessage id="improvedSearch.filter.header" />
          </Typography>
          <hr />
          <Typography
            variant="label"
            group="input"
            style={{ textTransform: "uppercase", fontWeight: "400", marginTop: "1rem", marginBottom: "0.25rem" }}
            as="h3"
          >
            <FormattedMessage id="improvedSearch.community.filter.header" />
          </Typography>
          <StyledList>
            {items.map((item) => (
              <StyledItem key={item.value}>
                <Checkbox
                  value={item.value}
                  label={`${item.label} (${item.count})`}
                  checked={item.isRefined}
                  onChange={() => refine(item.value)}
                />
              </StyledItem>
            ))}
          </StyledList>
        </EdsProvider>
      ) : (
        <NoRelevant>
          <Typography group="paragraph" variant="meta" color={tokens.colors.text.static_icons__tertiary.hex}>
            <FormattedMessage id="asset.no.relevant.filters" defaultMessage="No assets for this filter" />
          </Typography>
        </NoRelevant>
      )}
    </div>
  )
}
