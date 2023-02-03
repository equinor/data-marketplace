import { List, Checkbox, EdsProvider, Typography } from "@equinor/eds-core-react"
import { useRefinementList, UseRefinementListProps } from "react-instantsearch-hooks-web"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

export type RefinementListProps = React.ComponentProps<"div"> & {
  label: string
} & UseRefinementListProps

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
export const PlainRefinementList = (props: RefinementListProps) => {
  const { items, refine } = useRefinementList(props)
  return (
    <div>
      <EdsProvider density="compact">
        <Typography
          variant="label"
          group="input"
          style={{ textTransform: "uppercase", fontWeight: "400", marginTop: "1rem", marginBottom: "0.25rem" }}
          as="h3"
        >
          {/*  eslint-disable-next-line react/destructuring-assignment */}
          {props.label}
        </Typography>
        {items.length > 0 ? (
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
        ) : (
          <NoRelevant>
            <FormattedMessage id="asset.no.relevant.filters" defaultMessage="No assets for this filter" />
          </NoRelevant>
        )}
      </EdsProvider>
    </div>
  )
}