import {
  Typography, List, Chip, Card,
} from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { NextPage } from "next"
import styled from "styled-components"

import { Container } from "../components/Container"
import { TruncatedDescription } from "../components/helpers"

const { Item } = List
const { Header: CardHeader, HeaderTitle, Content: CardContent } = Card

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

const mockData = [
  {
    id: 1,
    name: "Automatic Identification System (AIS) vessel positions",
    // Will containt unknown, random HTML :/
    description: `Automatic identification system (AIS) data from the AIS transcender at 
    the offshore subsation in the Dudgeon wind farm. The AIS data is available as a a real-time
    stream of raw data, and includes information about vessels such as unique identification,
    position, course and speed. Automatic identification system (AIS) data from the AIS transcender at 
    the offshore subsation in the Dudgeon wind farm. The AIS data is available as a a real-time
    stream of raw data, and includes information about vessels such as unique identification,
    position, course and speed.`,
    // Dunno anything about this yet
    domain: ["Renewables"],
  },
  {
    id: 2,
    name: "Operational timeseries measurements (raw) - wind farm",
    description: "Raw operational timeseries data exported from the wind farm management system (Bazefield) via the Bazefield2Omnia pipeline and stored as json files in omnia data lake. Ca. 350 GB of data per day representing the tags/measurements.",
    domain: ["Renewables", "Something else"],
  },
]

const CartView : NextPage = () => (
  <Container>
    <Content>
      <Typography variant="h1">Cart header</Typography>
      <CartItems>
        {mockData.map((item) => (
          <CartItem key={item.id}>
            <Card elevation="raised">
              <CardHeader>
                <HeaderTitle>
                  {/* This is just a dummy example */}
                  <Tags>
                    {item.domain.map((domain) => <Chip key={domain} style={{ display: "inline-block" }}>{domain}</Chip>)}
                  </Tags>
                  <Typography variant="h2">{item.name}</Typography>
                </HeaderTitle>
              </CardHeader>
              <CardContent>
                <TruncatedDescription variant="body_long" lines={3}>{item.description}</TruncatedDescription>
              </CardContent>
            </Card>
          </CartItem>
        ))}
      </CartItems>
      <p style={{ padding: "1rem", margin: "1rem 0", backgroundColor: `${tokens.colors.ui.background__warning.rgba}` }}>Placeholder for a banner component</p>
    </Content>
  </Container>
)

export default CartView
