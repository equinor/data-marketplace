import { Card, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { VoidFunctionComponent } from "react"
import styled from "styled-components"

const ResponsibilitiesContentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1.5rem;
`

const ResponsibilitiesSectionContainer = styled.div`
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

export type ResponsibilitiesContentSections = {
  role: string
  id: string
  firstName: string
  lastName: string
  email: string
}

type Props = {
  content: ResponsibilitiesContentSections
}

export const ResponsibilitiesContent: VoidFunctionComponent<Props> = () => (
  <ResponsibilitiesContentContainer>
    <ResponsibilitiesSectionContainer>
      <Typography variant="overline">Owner</Typography>

      <ResponsibilityCard>
        <Card.Header>
          <Card.HeaderTitle>Eskil Høyen Solvang</Card.HeaderTitle>
        </Card.Header>
        <Card.Content>
          <Typography variant="body_short" href="mailto:email@equinor.com" link>email@equinor.com</Typography>
        </Card.Content>
      </ResponsibilityCard>
    </ResponsibilitiesSectionContainer>

    <ResponsibilitiesSectionContainer>
      <Typography variant="overline">Data steward</Typography>

      <ResponsibilityCard>
        <Card.Header>
          <Card.HeaderTitle>Thibaut Forest</Card.HeaderTitle>
        </Card.Header>
        <Card.Content>
          <Typography variant="body_short" href="mailto:email@equinor.com" link>email@equinor.com</Typography>
        </Card.Content>
      </ResponsibilityCard>
    </ResponsibilitiesSectionContainer>

    <ResponsibilitiesSectionContainer>
      <Typography variant="overline">Data office admin</Typography>

      <ResponsibilityCard>
        <Card.Header>
          <Card.HeaderTitle>Eskil Høyen Solvang</Card.HeaderTitle>
        </Card.Header>
        <Card.Content>
          <Typography variant="body_short" href="mailto:email@equinor.com" link>email@equinor.com</Typography>
        </Card.Content>
      </ResponsibilityCard>

      <ResponsibilityCard>
        <Card.Header>
          <Card.HeaderTitle>Per Norman Oma</Card.HeaderTitle>
        </Card.Header>
        <Card.Content>
          <Typography variant="body_short" href="mailto:email@equinor.com" link>email@equinor.com</Typography>
        </Card.Content>
      </ResponsibilityCard>
    </ResponsibilitiesSectionContainer>

    <ResponsibilitiesSectionContainer>
      <Typography variant="overline">Technical steward</Typography>

      <ResponsibilityCard>
        <Card.Header>
          <Card.HeaderTitle>Ramya Rajgopal</Card.HeaderTitle>
        </Card.Header>
        <Card.Content>
          <Typography variant="body_short" href="mailto:email@equinor.com" link>email@equinor.com</Typography>
        </Card.Content>
      </ResponsibilityCard>

      <ResponsibilityCard>
        <Card.Header>
          <Card.HeaderTitle>Robert Andrew Dowsett</Card.HeaderTitle>
        </Card.Header>
        <Card.Content>
          <Typography variant="body_short" href="mailto:email@equinor.com" link>email@equinor.com</Typography>
        </Card.Content>
      </ResponsibilityCard>
    </ResponsibilitiesSectionContainer>
  </ResponsibilitiesContentContainer>
)
