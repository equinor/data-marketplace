import { usePagination } from 'react-instantsearch-hooks-web'
import { Button } from "./Button"
import styled from 'styled-components'


const StyledListItem = styled.li`
  display: inline-block;
`

const PaginationLink = styled(Button)<{ isCurrent?: boolean; inverted?: boolean }>`
  width: 44px;
  height: 44px;
  color: ${(props) => (props.inverted ? 'hsl(184, 31%, 74%)' : 'hsl(206, 32%, 21%);')}
  ${({ isCurrent, inverted }) =>
    isCurrent && {
      background: inverted ? 'hsl(184, 31%, 74%)' : 'hsl(184, 100%, 24%)',
      color: inverted ? 'hsl(0, 0%, 0%)' : 'rgba(61, 61, 61, 1)',
    }}

  :hover {
    color: ${(props) => (props.inverted ? 'vhsl(0, 0%, 0%)' : '')};

    :disabled {
      color: ${(props) => (props.inverted ? 'hsl(207, 14%, 37%)' : 'hsl(0, 0%, 86%)')};
    }
  }

  :disabled {
    cursor: auto;
    color: ${(props) => (props.inverted ? 'hsl(207, 14%, 37%)' : 'hsl(0, 0%, 86%)')};
  }
`

export function isModifierClick(event: React.MouseEvent) {
  const isMiddleClick = event.button === 1
  return Boolean(isMiddleClick || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
}

type PaginationItemProps = React.ComponentProps<'a'> &
  Pick<ReturnType<typeof usePagination>, 'refine' | 'createURL'> & {
    isDisabled: boolean
    value: number
    isCurrent: boolean
    ariaLabel?: string
    inverted?: boolean
  }

export const PaginationItem = ({
  isDisabled,
  value,
  isCurrent,
  ariaLabel,
  refine,
  inverted,
  children,
}: PaginationItemProps) => {
  if (isDisabled || isCurrent) {
    return (
      <StyledListItem>
        <PaginationLink
          disabled={isDisabled}
          isCurrent={isCurrent}
          inverted={inverted}
          variant="ghost_icon"
          aria-label={ariaLabel}
        >
          {children}
        </PaginationLink>
      </StyledListItem>
    )
  }

  return (
    <StyledListItem>
      <PaginationLink
        disabled={isDisabled}
        variant="ghost_icon"
        aria-label={ariaLabel}
        inverted={inverted}
        onClick={(event) => {
          if (isModifierClick(event)) {
            return
          }

          event.preventDefault()
          refine(value)
        }}
      >
        {children}
      </PaginationLink>
    </StyledListItem>
  )
}
