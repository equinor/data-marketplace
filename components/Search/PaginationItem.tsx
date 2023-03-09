import { Button, List, ListItemProps } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { usePagination } from "react-instantsearch-hooks-web"
import styled from "styled-components"

const PaginationLink = styled(Button)<{ isCurrent?: boolean }>`
  --button-size: 44px;
  width: var(--button-size);
  height: var(--button-size); 
  color: ${tokens.colors.text.static_icons__default.rgba}}
  ${({ isCurrent }) =>
    isCurrent && {
      background: tokens.colors.ui.background__default.rgba,
      color: tokens.colors.interactive.secondary__link_hover.rgba,
    }}
  :hover {
    /* Not an EDS colour */
    background-color: rgba(186, 209, 220, 1);
  :disabled {
    cursor: auto;
    color: ${tokens.colors.interactive.disabled__text.rgba};
  }
`
const { Item: EdsItem } = List

const StyledListItem = styled(EdsItem)``

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
        onClick={(event: React.MouseEvent) => {
          event.preventDefault()
          window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
          })
          refine(value)
        }}
      >
        {children}
      </PaginationLink>
    </StyledListItem>
  )
}