import { Typography, Table } from "@equinor/eds-core-react"
import styled from "styled-components"

const TableCell = styled(Table.Cell)`
  padding: 0.75rem 0;
  column-gap: 0.5rem;
  width: 20rem;
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
  <Table>
    <Table.Body>
      <Typography variant="overline">{headline}</Typography>

      {holders.map((holder) => (
        <Table.Row key={holder.id}>
          <TableCell>
            <Typography>
              {holder.firstName}
              {" "}
              {holder.lastName}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography variant="body_short" href={`mailto:${holder.email.toLowerCase()}`} link>{holder.email.toLowerCase()}</Typography>
          </TableCell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)
