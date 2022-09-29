import { Table as EdsTable } from "@equinor/eds-core-react"

const { Body, Row, Cell } = EdsTable

export const Table = ({ value }: any) => (
  <EdsTable>
    <Body>
      {value.rows.map((row: any) => (
        <Row key={row.key}>
          {row.cells.map((cell: any) => (
            <Cell key={cell.key}>
              {cell.text.trim()}
            </Cell>
          ))}
        </Row>
      ))}
    </Body>
  </EdsTable>
)
