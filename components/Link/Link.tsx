import { tokens } from "@equinor/eds-tokens"
import NextLink, { LinkProps } from "next/link"
import type { AnchorHTMLAttributes, FunctionComponent } from "react"
import styled from "styled-components"

import { config } from "../../config"

const StyledLink = styled.a<{ link?: boolean }>`
  text-decoration: ${({ link }) => (link ? "underline" : "none")};
  color: ${({ link }) => (link ? tokens.colors.interactive.primary__resting.hex : "inherit")};
`

type Props =
  & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>
  & Omit<LinkProps, "passHref"|"prefetch"|"locale"|"legacyBehavior"|"shallow"|"scroll"|"replace"|"as">
  & {
    /** Enable link styling */
    link?: boolean
  }

export const Link: FunctionComponent<Props> = ({
  children,
  link,
  href,
  ...rest
}) => {
  if (
    typeof href === "string"
    && href.startsWith("http")
    && new URL(config.BASE_URL).hostname !== new URL(window.location.href).hostname
  ) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <StyledLink href={href} target="_blank" rel="noopener noreferrer nofollow" link={link} {...rest}>
        {children}
      </StyledLink>
    )
  }

  return (
    <NextLink href={href} passHref>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, react/jsx-props-no-spreading */}
      <StyledLink link={link} {...rest}>
        {children}
      </StyledLink>
    </NextLink>
  )
}
