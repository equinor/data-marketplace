import { Button, List, ListItemProps } from "@equinor/eds-core-react"
import { usePagination } from "react-instantsearch-hooks-web"
import styled from "styled-components"

const PaginationLink = styled(Button)<{ isCurrent?: boolean }>`
  width: 44px;
  height: 44px;
  color: ("hsl(206, 32%, 21%);")}
  ${({ isCurrent }) =>
    isCurrent && {
      background: "hsl(184, 100%, 24%)",
      color: "rgba(61, 61, 61, 1)",
    }}
  :hover {
    color: ( "")};

    :disabled {
      color: ("hsl(0, 0%, 86%)")};
    }
  }

  :disabled {
    cursor: auto;
    color:  ( "hsl(0, 0%, 86%)")};
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
