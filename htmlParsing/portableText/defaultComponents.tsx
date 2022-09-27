/* eslint-disable react/jsx-no-useless-fragment */
import { Typography, List } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { PortableTextBlock } from "@portabletext/types"
import styled from "styled-components"

import { isEmpty } from "../helpers"

const { Item } = List
const StyledList = styled(List)`
  margin: ${tokens.spacings.comfortable.medium};
`

const StyledTypography = styled(Typography)`
  margin-block: ${tokens.spacings.comfortable.medium};
`

export const defaultComponents = {
  block: {
    normal: ({ children }: PortableTextBlock) => {
      if (isEmpty(children)) return null
      return (
        <StyledTypography variant="body_long">
          <>{children}</>
        </StyledTypography>
      )
    },
  },
  list: {
    bullet: ({ children }: PortableTextBlock) => (
      <StyledList><>{children}</></StyledList>
    ),
    number: ({ children }: PortableTextBlock) => (
      <StyledList variant="numbered"><>{children}</></StyledList>
    ),
  },
  listItem: ({ children }: PortableTextBlock) => (
    <Item><>{children}</></Item>
  ),
}
