import {
  Card,
  Typography,
} from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { VoidFunctionComponent } from "react"
import styled from "styled-components"

const Container = styled.div`
  > p {
    margin-bottom: 0.25rem;
  }

  > div:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`

const ResponsibilityCard = styled.div`
  box-shadow: ${tokens.elevation.raised};
  border-radius: ${tokens.shape.corners.borderRadius};
`

export type ResponsibilityHolder = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type Props = {
  headline: string
  holders: ResponsibilityHolder[]
}

export const ResponsibilitiesHolderList: VoidFunctionComponent<Props> = ({
  headline,
  holders,
}) => (
  <Container>
    <Typography variant="overline">{headline}</Typography>

    {holders.map((holder) => (
      <ResponsibilityCard key={holder.id}>
        <Card.Header>
          <Card.HeaderTitle>
            {holder.firstName}
            {" "}
            {holder.lastName}
          </Card.HeaderTitle>
        </Card.Header>
        <Card.Content>
          <Typography variant="body_short" href={`mailto:${holder.email.toLowerCase()}`} link>{holder.email.toLowerCase()}</Typography>
        </Card.Content>
      </ResponsibilityCard>
    ))}
  </Container>
)
