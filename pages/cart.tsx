/* eslint-disable camelcase */
import {
  Typography, List, Chip, Card, Button, CircularProgress,
  Icon,
} from "@equinor/eds-core-react"
import {
  chevron_right,
  shopping_card,
} from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { NextPage } from "next"
import NextLink from "next/link"
import { useEffect, useState } from "react"
import { useIntl } from "react-intl"
import { useSelector } from "react-redux"
import styled from "styled-components"

import { Container } from "../components/Container"
import { Link } from "../components/Link"
import { TruncatedDescription } from "../components/helpers"
import { HttpClient } from "../lib/HttpClient"
import { RootState } from "../store"

const { Item } = List
const { Header: CardHeader, HeaderTitle: CardHeaderTitle, Content: CardContent } = Card

const Title = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
`
const CartIcon = styled(Icon)`
  flex-shrink: 0;
`

const CartItems = styled(List)`
  margin: 1.5rem 0;
  padding: 0;
  list-style: none;
`

const CartItem = styled(Item)`
  :not(:first-child) {
    margin-top: 1rem;
  }
`
const Tags = styled.div`
  padding: 0.25rem 0;
`

const Content = styled.main`
  /*  @TODO tbd */
  max-width: 50rem;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

type CartContent = {
  id: string,
  name: string,
  description: string,
  domain?: string[]
}

const CartView : NextPage = () => {
  const intl = useIntl()
  const [cartContent, setCartContent] = useState<CartContent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addedAssets = useSelector((state: RootState) => state.checkout.cart)
  const numberOfItems = addedAssets.length

  useEffect(() => {
    let ignore = false

    const getData = async () => {
      setIsLoading(true)
      try {
        const allAssetNames = addedAssets.map(async (assetId) => {
          const assetCore = await HttpClient.get(`/api/assets/${assetId}`, {
            headers: { authorization: `Bearer: ${window.localStorage.getItem("access_token")}` },
          })

          const assetDetails = await HttpClient.get(`/api/assets/${assetId}/overview`, {
            headers: { authorization: `Bearer: ${window.localStorage.getItem("access_token")}` },
          })

          if (!ignore) {
            setCartContent((c) => {
              // We need to avoid duplicates, so let's just add this if the array doesn't
              // contain an asset object with the same id.
              // We should look into how we can improve data fetching without SSR
              if (!c.some((asset) => asset.id === assetId)) {
                const cartItems = [...c, {
                  id: assetId,
                  name: assetCore.body?.name,
                  description: assetDetails.body?.description,
                  domain: ["Some tag"],
                }]
                return cartItems.sort((a, b) => a.name.localeCompare(b.name))
              }
              return c
            })
          }
        })
        await Promise.all(allAssetNames)
        setIsLoading(false)
      } catch (error) {
        // @TODO: Improve the  flow with 401 Unauthorized
        setIsLoading(false)
        console.error("Failed while getting asset", error)
      }
    }

    getData()
    return () => {
      ignore = true
    }
  }, [addedAssets])

  return (
    <Container>
      <Content>
        <Title>
          <CartIcon data={shopping_card} />
          <Typography variant="h1">
            {intl.formatMessage({ id: "cart.headline" }, {
              count: numberOfItems,
            })}
          </Typography>
        </Title>
        {isLoading ? <CircularProgress />
          : numberOfItems > 0
        && (
          <CartItems>
            {cartContent.map((item) => (
              <CartItem key={item.id}>
                <Card elevation="raised">
                  <Link href={{ pathname: "/assets/[id]", query: { id: item.id } }} title={item.name}>
                    <CardHeader>
                      <CardHeaderTitle>
                        {/* This is just a dummy example */}
                        {item.domain && item.domain.length > 0 && (
                          <Tags>
                            {item.domain.map((domain) => <Chip key={domain} style={{ display: "inline-block" }}>{domain}</Chip>)}
                          </Tags>
                        )}
                        <Typography variant="h2">{item.name}</Typography>
                      </CardHeaderTitle>
                    </CardHeader>
                    <CardContent>
                      <TruncatedDescription variant="body_long" lines={3} dangerouslySetInnerHTML={{ __html: item.description }} />
                    </CardContent>
                  </Link>
                </Card>

              </CartItem>
            ))}
          </CartItems>
        )}

        <p style={{ padding: "1rem", margin: "1rem 0", backgroundColor: `${tokens.colors.ui.background__warning.rgba}` }}>Placeholder for a banner component</p>
        {numberOfItems > 0
        && (
          <ButtonContainer>
            <NextLink href="/checkout/terms" passHref>
              <Button
                as="a"
              >
                {intl.formatMessage({ id: "cart.proceedToCheckout" })}
                <Icon data={chevron_right} />
              </Button>
            </NextLink>
          </ButtonContainer>
        ) }
      </Content>
    </Container>
  )
}

export default CartView
