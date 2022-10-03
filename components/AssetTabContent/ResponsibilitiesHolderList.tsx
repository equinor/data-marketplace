import { Typography, Table } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useIntl } from "react-intl"
import styled from "styled-components"

const TableCell = styled(Table.Cell)`
  width: 20rem;
`

const StyledCaption = styled(Table.Caption)`
  margin-bottom: ${tokens.spacings.comfortable.medium}
`

const HeaderCell = styled(Table.Cell)`
  background-color: ${tokens.colors.infographic.primary__moss_green_13.hex};
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
}: Props) => {
  const intl = useIntl()

  return (
    <Table>
      <StyledCaption>
        <Typography variant="h5" as="div">{headline}</Typography>
      </StyledCaption>
      <Table.Head>
        <Table.Row>
          <HeaderCell>
            {intl.formatMessage({ id: "responsibility.header.name" })}
          </HeaderCell>
          <HeaderCell>
            {intl.formatMessage({ id: "responsibility.header.email" })}
          </HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {holders.map((holder) => (
          <Table.Row key={`${headline.replace(/\s+/g, "-").toLowerCase()}_${holder.id}`}>
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
}
