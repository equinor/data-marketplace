/* eslint-disable camelcase */
import { Typography, Icon } from "@equinor/eds-core-react"
import { external_link } from "@equinor/eds-icons"
import { FunctionComponent } from "react"
import styled from "styled-components"

import { Heading } from "components/Typography"
import { elevations } from "styles/globals"

const StyledCard = styled.div`
  height: 100%;
  background-color: var(--white);
  padding: var(--space-16);
  border-radius: var(--space-4);
  box-shadow: ${elevations.medium};
  position: relative;
`

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledHeading = styled(Heading)`
  position: relative;
  display: inline-block;
  margin-bottom: var(--space-16);
  &:after {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 0px;
    display: block;
    width: 0;
    border-bottom: solid 0.5px rgba(61, 61, 61, 1);
    transition: all 250ms ease 0s;
    transition-delay: 250ms;
  }

  ${StyledCard}:hover & {
    &:after {
      width: 100%;
    }
  }
`

type Props = {
  header: string
  content: string
}

export const InformationCard: FunctionComponent<Props> = ({ header, content }) => (
  <StyledCard>
    <Flex>
      <StyledHeading level="h3" size="lg">
        {header}
      </StyledHeading>
      <Icon data={external_link} style={{ marginTop: "3px" }} />
    </Flex>
    <Typography variant="body_long">{content}</Typography>
  </StyledCard>
)
