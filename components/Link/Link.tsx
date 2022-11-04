import { tokens } from "@equinor/eds-tokens"
import NextLink, { LinkProps } from "next/link"
import type { AnchorHTMLAttributes, FunctionComponent } from "react"
import styled from "styled-components"

const StyledExternalLink = styled.a`
  text-decoration: underline;
  color: ${tokens.colors.interactive.primary__resting.hex};
`

const StyledInternalLink = styled(NextLink)`
  text-decoration: none;
  color: inherit;
`

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  Omit<LinkProps, "passHref" | "prefetch" | "locale" | "legacyBehavior" | "shallow" | "scroll" | "replace" | "as"> & {
    /** Enable link styling */
    link?: boolean
  }

export const Link: FunctionComponent<Props> = ({ children, href, ...rest }) => {
  if (
    typeof href === "string" &&
    href.startsWith("http") &&
    new URL(window.location.href).hostname !== new URL(href).hostname
  ) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <StyledExternalLink href={href} target="_blank" rel="noopener noreferrer nofollow" {...rest}>
        {children}
      </StyledExternalLink>
    )
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledInternalLink href={href} passHref {...rest}>
      {children}
    </StyledInternalLink>
  )
}
