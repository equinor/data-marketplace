import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import styled from "styled-components"

const Container = styled.div`
  > p {
    margin-bottom: 0.25rem;
  }

  > div:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`

const ResponsibilityRow = styled.div`
  border-bottom: 1px solid ${tokens.colors.ui.background__medium.hex};
  padding: 0.75rem 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 0.5rem;
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

export const ResponsibilitiesHolderList = ({
  headline,
  holders,
}: Props) => (
  <Container>
    <Typography variant="overline">{headline}</Typography>

    {holders.map((holder) => (
      <ResponsibilityRow key={holder.id}>
        <Typography>
          {holder.firstName}
          {" "}
          {holder.lastName}
        </Typography>

        <Typography variant="body_short" href={`mailto:${holder.email.toLowerCase()}`} link>{holder.email.toLowerCase()}</Typography>
      </ResponsibilityRow>
    ))}
  </Container>
)
