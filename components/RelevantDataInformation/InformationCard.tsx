import { Card, Typography } from "@equinor/eds-core-react"
import { FunctionComponent } from "react"
import styled from "styled-components"

import { Heading } from "components/Typography"

const { Header, HeaderTitle, Content } = Card

type Props = {
  header: string
  content: string
}

const StyledCard = styled(Card)`
  height: 100%;
`

export const InformationCard: FunctionComponent<Props> = ({ header, content }) => (
  <StyledCard elevation="raised">
    <Header>
      <HeaderTitle>
        <Heading level="h4" size="lg">
          {header}
        </Heading>
      </HeaderTitle>
    </Header>
    <Content>
      <Typography variant="body_short">{content}</Typography>
    </Content>
  </StyledCard>
)
