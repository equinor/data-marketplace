import { Card } from "@equinor/eds-core-react"
import { FunctionComponent } from "react"
import styled from "styled-components"

import { Heading } from "components/Typography"

const { Header, HeaderTitle } = Card

type Props = {
  header: string
}

const StyledCard = styled(Card)`
  height: 100%;
`

export const BusinessAreaCard: FunctionComponent<Props> = ({ header }) => (
  <StyledCard elevation="raised">
    <Header>
      <HeaderTitle>
        <Heading level="h4" size="lg">
          {header}
        </Heading>
      </HeaderTitle>
    </Header>
  </StyledCard>
)
