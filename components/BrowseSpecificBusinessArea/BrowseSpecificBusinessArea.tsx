import { tokens } from "@equinor/eds-tokens"
import NextLink from "next/link"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { BusinessAreaCard } from "./BusinessAreaCard"
import { businessAreas } from "./data"

import { Heading } from "components/Typography"

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 25ch), 1fr));
  grid-gap: ${tokens.spacings.comfortable.medium};
`

const StyledLink = styled(NextLink)`
  text-decoration: none;
  &:focus-visible {
    outline: 2px dashed ${tokens.colors.interactive.primary__resting.hex};
  }
`

export const BrowseSpecificBusinessArea = () => (
  <>
    <Heading level="h3" size="xl" style={{ marginBottom: tokens.spacings.comfortable.large }}>
      <FormattedMessage id="frontpage.browseSpecificBusinessArea.header" />
    </Heading>

    <GridContainer>
      {businessAreas.map((area) => (
        <StyledLink href={`/search-beta?${area.searchTerm}`} key={area.name}>
          <BusinessAreaCard header={area.name} />
        </StyledLink>
      ))}
    </GridContainer>
  </>
)
