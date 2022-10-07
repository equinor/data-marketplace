import { Card, Typography, List } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { FunctionComponent } from "react"
import styled from "styled-components"

import { Link } from "components/Link"

const { Header: CardHeader, HeaderTitle: CardHeaderTitle } = Card
const { Item } = List

const SearchResultItem = styled(Item)`
  &:not(:last-child) {
    margin-bottom: ${tokens.spacings.comfortable.large};
  }
`

type Props = {
  hit: {
    id: string
    name: string
  }
}

export const Hit: FunctionComponent<Props> = ({ hit }) => (
  <SearchResultItem key={hit.id}>
    <Link href={{ pathname: "/assets/[id]", query: { id: hit.id } }} title={hit.name}>
      <Card elevation="raised">
        <CardHeader>
          <CardHeaderTitle>
            <Typography variant="h5" as="h2">
              {hit.name}
            </Typography>
          </CardHeaderTitle>
        </CardHeader>
      </Card>
    </Link>
  </SearchResultItem>
)
