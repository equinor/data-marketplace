/* eslint-disable react/jsx-no-useless-fragment */
import {
  Typography, List,
} from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { PortableTextBlock } from "@portabletext/types"
import styled from "styled-components"

import { isEmpty } from "../helpers"

import { Table } from "./Table"

const { Item } = List

const StyledList = styled(List)`
  margin-block: ${tokens.spacings.comfortable.medium};
`

const StyledTypography = styled(Typography)`
  margin-block: ${tokens.spacings.comfortable.medium};
  &:last-child {
    margin-bottom: 0;
  }
`

export const defaultComponents = {
  types: {
    table: Table,
  },
  block: {
    normal: ({ children }: PortableTextBlock) => {
      if (isEmpty(children)) return null
      return (
        <StyledTypography variant="body_long">
          <>{children}</>
        </StyledTypography>
      )
    },
    /* In our application, h2 level is the description title */
    h2: ({ children }: PortableTextBlock) => {
      if (isEmpty(children)) return null
      return (
        <Typography style={{ margin: `${tokens.spacings.comfortable.medium} 0` }} variant="h4" as="h3">
          <>{children}</>
        </Typography>
      )
    },
    h3: ({ children }: PortableTextBlock) => {
      if (isEmpty(children)) return null
      return (
        /* No margins here on purpose */
        <Typography variant="h5" as="h4">
          <>{children}</>
        </Typography>
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
