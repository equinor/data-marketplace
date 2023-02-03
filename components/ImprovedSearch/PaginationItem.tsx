import { Button, List, ListItemProps } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { usePagination } from "react-instantsearch-hooks-web"
import styled from "styled-components"

const PaginationLink = styled(Button)<{ isCurrent?: boolean }>`
  --button-size: 44px;
  width: var(--button-size);
  height: var(--button-size); 
  color: ("hsl(206, 32%, 21%);")}
  ${({ isCurrent }) =>
    isCurrent && {
      background: tokens.colors.interactive.primary__resting.hex,
      color: tokens.colors.text.static_icons__default.hex,
    }}
  :hover {
    color: tokens.colors.interactive.primary__resting.hex;

    :disabled {
      color: tokens.colors.ui.background__medium.hex;
    }
  }

  :disabled {
    cursor: auto;
    color: tokens.colors.ui.background__medium.hex;
  }
`

export const isModifierClick = (event: React.MouseEvent) => {
  const isMiddleClick = event.button === 1
  return Boolean(isMiddleClick || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
}

type PaginationItemProps = ListItemProps &
  Pick<ReturnType<typeof usePagination>, "refine" | "createURL"> & {
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
      <List>
        <PaginationLink
          disabled={isDisabled}
          isCurrent={isCurrent}
          inverted={inverted}
          variant="ghost_icon"
          aria-label={ariaLabel}
        >
          {children}
        </PaginationLink>
      </List>
    )
  }

  return (
    <List>
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
    </List>
  )
}
