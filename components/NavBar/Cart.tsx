/* eslint-disable camelcase */
import { Button, Icon } from "@equinor/eds-core-react"
import {
  shopping_card,
} from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import NextLink from "next/link"
import { useIntl } from "react-intl"
import { useSelector } from "react-redux"
import styled from "styled-components"

import { RootState } from "../../store"

const Badge = styled.span`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  display: grid;
  place-content: center;
  background-color: ${tokens.colors.infographic.primary__moss_green_100.hsla};
  position: absolute;
  top: 8px;
  right: 8px;
  color: white;
  font-size: 0.75rem;
`

export const Cart = () => {
  const cartContent = useSelector((state: RootState) => state.checkout.cart) ?? []
  const numberOfItems = cartContent.length

  const intl = useIntl()
  return (
    <NextLink href="/cart" passHref>
      <Button variant="ghost_icon" as="a" color="secondary">
        <Icon data={shopping_card} title={intl.formatMessage({ id: "navbar.titleShoppingCart" })} />
        {numberOfItems > 0 && <Badge>{numberOfItems}</Badge>}
      </Button>
    </NextLink>
  )
}
