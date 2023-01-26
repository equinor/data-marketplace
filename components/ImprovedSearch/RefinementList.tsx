import { useRefinementList, UseRefinementListProps } from 'react-instantsearch-hooks-web'
import { List, Checkbox } from "@equinor/eds-core-react"
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'


export type RefinementListProps = React.ComponentProps<'div'> & UseRefinementListProps

const { Item } = List

const NoRelevant = styled.span`
  padding: var(--space-small) 0;
  display: inline-block;
  padding: var(--space-small) var(--space-large);
`
const StyledList = styled(List)`
  margin: var(--space-medium) 0;
`

const StyledItem = styled(Item)`
  padding-left: var(--space-small);
`
export function RefinementList(props: RefinementListProps) {
  const { items, refine } = useRefinementList(props)

  return (
    <>
      {items.length > 0 ? (
        <StyledList>
          {items.map((item) => (
            <StyledItem key={item.value}>
              <Checkbox
                value={item.value}
                checked={item.isRefined}
                onChange={() => refine(item.value)}
              ></Checkbox>
            </StyledItem>
          ))}
        </StyledList>
      ) : (
        <NoRelevant>
          <FormattedMessage id="asset.no.relevant.filters" defaultMessage="No assets for this filter" />
        </NoRelevant>
      )}
    </>
  )
}