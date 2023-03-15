"use client"

import { Typography, TypographyProps } from "@equinor/eds-core-react"
import { FunctionComponent } from "react"
import styled from "styled-components"

type StyledHeadingProps = {
  center: boolean
  uppercase: boolean
} & TypographyProps

const StyledHeading = styled(Typography)<StyledHeadingProps>`
  ${({ center }) =>
    center && {
      textAlign: "center",
    }}
`

const sizes = {
  xs: "var(--text-xs)",
  sm: "var(--text-sm)",
  base: "var(--text-base)",
  lg: "var(--text-lg)",
  xl: "var(--text-xl)",
  "2xl": "var(--text-2xl)",
}

const lineHeights = {
  xs: 1.333,
  sm: 1.142,
  base: 1.25,
  lg: 1.25,
  xl: 1.25,
  "2xl": 1.25,
}

type HeadingProps = {
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  center?: boolean
  uppercase?: boolean
  bold?: boolean
} & TypographyProps

export const Heading: FunctionComponent<HeadingProps> = ({
  size = "lg",
  level = "h3",
  bold = false,
  center = false,
  uppercase = false,
  children,
  ...rest
}) => (
  <StyledHeading
    variant={level}
    center={center}
    token={{
      // Need to add this in a token because EDS only allows h1 to be bold
      fontWeight: bold ? 700 : 400,
      fontSize: sizes[size],
      lineHeight: lineHeights[size],
      textTransform: uppercase ? "uppercase" : "none",
      fontFamily: "inherit",
    }}
    // eslint-disable-next-line react/jsx-props-no-spreading,
    {...rest}
  >
    {children}
  </StyledHeading>
)
