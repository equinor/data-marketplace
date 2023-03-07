import { tokens } from "@equinor/eds-tokens"
import NextLink from "next/link"
import { FunctionComponent, PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { BusinessAreaCard } from "./BusinessAreaCard"
import { businessAreas } from "./data"

import { Heading } from "components/Typography"

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 25ch), 1fr));
  grid-gap: ${tokens.spacings.comfortable.medium};
`

const StyledLink = styled(NextLink)`
  text-decoration: none;
  &:focus-visible {
    outline: 2px dashed ${tokens.colors.interactive.primary__resting.hex};
  }
`

type Props = PropsWithChildren<{
  indexName: string
}>

export const BrowseSpecificBusinessArea: FunctionComponent<Props> = ({ indexName }) => (
  <>
    <Heading level="h2" size="xl" style={{ marginBottom: tokens.spacings.comfortable.large }}>
      <FormattedMessage id="frontpage.browseSpecificBusinessArea.header" />
    </Heading>

    <GridContainer>
      {businessAreas.map((area) =>
        area.searchTerm ? (
          <StyledLink href={`/search-beta?${area.searchTerm(indexName)}`} key={area.name}>
            <BusinessAreaCard header={area.name} />
          </StyledLink>
        ) : (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <BusinessAreaCard header={area.name} key={area.name} {...area} />
        )
      )}
    </GridContainer>
  </>
)
