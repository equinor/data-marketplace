import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { AssetTabContentSectionContainer } from "./AssetTabContentSectionContainer"

/* const StyledTypography = styled(Typography)`
  margin-bottom: ${tokens.spacings.comfortable.small}
` */

const Overview = styled.div`
  padding: ${tokens.spacings.comfortable.x_large} 0;
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacings.comfortable.x_large};
  max-width: 70ch;
`

export type OverviewContentSections = {
  description?: string
  purpose?: string
  timeliness?: string
}

type Props = {
  content?: OverviewContentSections
}

export const OverviewContent = ({ content }: Props) => (
  <Overview>
    {content?.description && (
      <AssetTabContentSectionContainer>
        <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2"><FormattedMessage id="asset.description" /></Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.description }} />
      </AssetTabContentSectionContainer>
    )}
    {content?.purpose && (
      <AssetTabContentSectionContainer>
        <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2"><FormattedMessage id="asset.purpose" /></Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.purpose }} />
      </AssetTabContentSectionContainer>
    )}
    {content?.timeliness && (
      <AssetTabContentSectionContainer>
        <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2"><FormattedMessage id="asset.timeliness" /></Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.timeliness }} />
      </AssetTabContentSectionContainer>
    )}
  </Overview>
)
