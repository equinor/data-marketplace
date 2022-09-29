import { Table as EdsTable } from "@equinor/eds-core-react"

const {
  Body, Row, Cell, Head,
} = EdsTable

export const Table = ({ value }: any) => (
  <EdsTable>
    {value.headerRow
    && (
      <Head>
        {value.headerRow.map((row: any) => (
          <Row key={row.key}>
            {row.cells.map((cell: any) => (
              <Cell key={cell.key}>
                {cell.text.trim()}
              </Cell>
            ))}
          </Row>
        ))}
      </Head>
    )}
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
