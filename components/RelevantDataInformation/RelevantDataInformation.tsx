import { tokens } from "@equinor/eds-tokens"
import { useIntl, FormattedMessage } from "react-intl"
import styled from "styled-components"

import { InformationCard } from "./InformationCard"

import { Heading } from "components/Typography"

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 28ch), 1fr));
  grid-gap: ${tokens.spacings.comfortable.medium};
`

const StyledLink = styled.a`
  text-decoration: none;
  &:focus-visible {
    outline: 2px dashed ${tokens.colors.interactive.primary__resting.hex};
  }
`

export const RelevantDataInformation = () => {
  const intl = useIntl()

  return (
    <>
      <Heading level="h3" size="xl" style={{ marginBottom: tokens.spacings.comfortable.large }}>
        <FormattedMessage id="frontpage.relevantdatainfo.header" />
      </Heading>

      <GridContainer>
        <StyledLink href="https://statoilsrm.sharepoint.com/sites/Datatomany" target="_blank">
          <InformationCard
            header={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.tomany.title" })}
            content={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.tomany.text" })}
          />
        </StyledLink>
        <StyledLink href="https://statoilsrm.sharepoint.com/sites/Dataanalyticsnetwork" target="_blank">
          <InformationCard
            header={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.analytics.title" })}
            content={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.analytics.text" })}
          />
        </StyledLink>
        <StyledLink
          href="https://statoilsrm.sharepoint.com/sites/EDM/SitePages/Data%20Product%20Playbook.aspx"
          target="_blank"
        >
          <InformationCard
            header={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.product.title" })}
            content={intl.formatMessage({ id: "frontpage.relevantdatainfo.data.product.text" })}
          />
        </StyledLink>
      </GridContainer>
    </>
  )
}
