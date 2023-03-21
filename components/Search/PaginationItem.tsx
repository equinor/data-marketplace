import { Button, List, ListItemProps } from "@equinor/eds-core-react"
import NextLink from "next/link"
import { usePagination } from "react-instantsearch-hooks-web"
import styled from "styled-components"

const { Item: EdsItem } = List

const StyledListItem = styled(EdsItem)``

type PaginationItemProps = ListItemProps &
  Pick<ReturnType<typeof usePagination>, "refine" | "createURL"> & {
    isDisabled: boolean
    href: string
    isCurrent: boolean
    ariaLabel?: string
    inverted?: boolean
  }

export const PaginationItem = ({ isDisabled, isCurrent, ariaLabel, href, inverted, children }: PaginationItemProps) => {
  if (isDisabled) {
    return (
      <StyledListItem>
        <Button
          color="secondary"
          disabled={isDisabled}
          isCurrent={isCurrent}
          inverted={inverted}
          variant="ghost_icon"
          aria-label={ariaLabel}
          /* @ts-ignore */

          style={{ "--eds_interactive_secondary__highlight": "var(--baby-blue)" }}
        >
          {children}
        </Button>
      </StyledListItem>
    )
  }

  if (isCurrent) {
    return (
      <StyledListItem>
        <Button
          color="primary"
          disabled={isDisabled}
          isCurrent={isCurrent}
          inverted={inverted}
          variant="contained_icon"
          aria-label={ariaLabel}
          /* @ts-ignore */
          style={
            {
              "--eds_interactive_primary__resting": "var(--white)",
              "--eds_interactive_primary__hover": "var(--baby-blue)",
              "--eds_text__static_icons__primary_white": "black",
            } as React.CSSProperties
          }
        >
          {children}
        </Button>
      </StyledListItem>
    )
  }

  return (
    <StyledListItem>
      {/* @ts-ignore */}
      <Button
        color="secondary"
        href={href}
        as={NextLink}
        disabled={isDisabled}
        variant="ghost_icon"
        aria-label={ariaLabel}
        inverted={inverted}
        /* @ts-ignore */
        style={{ "--eds_interactive_secondary__highlight": "var(--baby-blue)" }}
      >
        {children}
      </Button>
    </StyledListItem>
  )
}
