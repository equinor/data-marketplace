import { Card, List } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import NextLink from "next/link"
import { FunctionComponent } from "react"
import styled from "styled-components"

import { Heading } from "components/Typography"

const { Header: CardHeader, HeaderTitle: CardHeaderTitle } = Card
const { Item } = List

const SearchResultItem = styled(Item)`
  &:not(:last-child) {
    margin-bottom: ${tokens.spacings.comfortable.large};
  }
`

const StyledLink = styled(NextLink)`
  text-decoration: none;
`

type Props = {
  hit: Collibra.NamedResource
}

export const Hit: FunctionComponent<Props> = ({ hit }) => {
  const { name, id } = hit
  return (
    <SearchResultItem>
      <StyledLink href={{ pathname: "/assets/[id]", query: { id } }}>
        <Card elevation="raised">
          <CardHeader>
            <CardHeaderTitle>
              <Heading level="h2" size="lg" bold>
                {name}
              </Heading>
            </CardHeaderTitle>
          </CardHeader>
        </Card>
      </StyledLink>
    </SearchResultItem>
  )
}
