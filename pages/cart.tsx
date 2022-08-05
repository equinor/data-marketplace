/* eslint-disable camelcase */
import {
  Typography, List, Chip, Card, Button, CircularProgress,
  Icon,
} from "@equinor/eds-core-react"
import {
  chevron_right,
  shopping_card,
} from "@equinor/eds-icons"
import { NextPage } from "next"
import NextLink from "next/link"
import { useIntl } from "react-intl"
import { useSelector } from "react-redux"
import styled from "styled-components"

import { Banner } from "../components/Banner"
import { Container } from "../components/Container"
import { Link } from "../components/Link"
import { TruncatedDescription } from "../components/helpers"
import { useCartContent } from "../hooks/useCartContent"
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

const CartView: NextPage = () => {
  const intl = useIntl()
  const { cartContent, isLoading, error } = useCartContent()

  // @TODO: Improve the  flow with 401 Unauthorized. We should show a banner in the
  // user interface or something like that
  if (error) {
    console.log(error)
  }

  const addedAssets = useSelector((state: RootState) => state.checkout.cart)
  const numberOfItems = addedAssets.length

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
        <Banner variant="warning">
          <Typography>{intl.formatMessage({ id: "cart.banner.warning" })}</Typography>
        </Banner>
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
          )}
      </Content>
    </Container>
  )
}

export default CartView
