import { Table as EdsTable } from "@equinor/eds-core-react"

const { Body, Row, Cell, Head } = EdsTable

/* eslint-disable no-underscore-dangle */
export const Table = ({ value }: any) => (
  <EdsTable>
    {value.headerRow && (
      <Head>
        {value.headerRow.map((row: any) => (
          <Row key={row._key}>
            {row.cells.map((cell: any) => (
              <Cell key={cell._key}>{cell.text.trim()}</Cell>
            ))}
          </Row>
        ))}
      </Head>
    )}
    <Body>
      {value.rows.map((row: any) => (
        <Row key={row._key}>
          {row.cells.map((cell: any) => (
            <Cell key={cell._key}>{cell.text.trim()}</Cell>
          ))}
        </Row>
      ))}
    </Body>
  </EdsTable>
)
