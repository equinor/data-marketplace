import { Typography } from "@equinor/eds-core-react"
import { HTMLAttributes, CSSProperties, FunctionComponent } from "react"
import styled from "styled-components"

type StyledHeadingProps = {
  center: boolean
  uppercase: boolean
}

const StyledHeading = styled(Typography)<StyledHeadingProps>`
  font-size: var(--size);
  line-height: var(--line-height);
  font-weight: var(--font-weight);

  ${({ uppercase }) =>
    uppercase && {
      textTransform: "uppercase",
    }}

  ${({ center }) =>
    center && {
      textAlign: "center",
    }}
`

export type HeadingProps = {
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
  level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  center?: boolean
  uppercase?: boolean
} & HTMLAttributes<HTMLHeadingElement>

/* Should be easy enough to change later on */
const sizes = {
  xs: "var(--text-xs)",
  sm: "var(--text-sm)",
  base: "var(--text-base)",
  lg: "var(--text-lg)",
  xl: "var(--text-xl)",
  "2xl": "var(--text-2xl)",
}

const lineHeights = {
  xs: "var(--lineHeight-2)",
  sm: "var(--lineHeight-1)",
  base: "var(--lineHeight-1)",
  lg: "var(--lineHeight-1)",
  xl: "var(--lineHeight-1)",
  "2xl": "var(--lineHeight-2)",
}

export const Heading: FunctionComponent<HeadingProps> = ({
  size = "lg",
  level = "h3",
  center = false,
  uppercase = false,
  style,
  children,
  ...rest
}) => (
  <StyledHeading
    variant={level}
    center={center}
    uppercase={uppercase}
    style={
      {
        "--size": sizes[size],
        "--line-height": lineHeights[size],
        ...style,
      } as CSSProperties
    }
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...rest}
  >
    {children}
  </StyledHeading>
)
