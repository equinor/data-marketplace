import { Typography, Table } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useIntl } from "react-intl"
import styled from "styled-components"

const TableCell = styled(Table.Cell)`
  width: 20rem;
`

const StyledCaption = styled(Table.Caption)`
  margin-bottom: ${tokens.spacings.comfortable.medium};
`

const HeaderCell = styled(Table.Cell)`
  background-color: var(--moss-green-13);
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

export const ResponsibilitiesHolderList = ({ headline, holders }: Props) => {
  const intl = useIntl()

  return (
    <Table>
      <StyledCaption>
        <Typography variant="h5" as="div">
          {headline}
        </Typography>
      </StyledCaption>
      <Table.Head>
        <Table.Row>
          <HeaderCell>{intl.formatMessage({ id: "responsibility.header.name" })}</HeaderCell>
          <HeaderCell>{intl.formatMessage({ id: "responsibility.header.email" })}</HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {holders.map((holder, idx) => (
          // We need to add an idx here because of issues with duplicate names inside several of the
          // tables from Collibra. (Tone Veila). This should be fixed in Collibra. The
          // unsafe use cases of idx doesn't apply to our use case,
          //  so disable the eslint rule here.
          // eslint-disable-next-line react/no-array-index-key
          <Table.Row key={`${headline.replace(/\s+/g, "-").toLowerCase()}_${holder.id}_${idx}`}>
            <TableCell>
              <Typography>
                {holder.firstName} {holder.lastName}
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="body_short" href={`mailto:${holder.email.toLowerCase()}`} link>
                {holder.email.toLowerCase()}
              </Typography>
            </TableCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
