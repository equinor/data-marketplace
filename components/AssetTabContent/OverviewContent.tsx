import { Typography } from "@equinor/eds-core-react"
import { FormattedMessage } from "react-intl"

import { AssetTabContentSectionContainer } from "./AssetTabContentSectionContainer"

export type OverviewContentSections = {
  description?: string
  purpose?: string
  timeliness?: string
}

type Props = {
  content?: OverviewContentSections
}

export const OverviewContent = ({ content }: Props) => (
  <div>
    {content?.description && (
      <AssetTabContentSectionContainer>
        <Typography variant="h3" as="h2"><FormattedMessage id="asset.description" /></Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.description }} />
      </AssetTabContentSectionContainer>
    )}
    {content?.purpose && (
      <AssetTabContentSectionContainer>
        <Typography variant="h3" as="h2"><FormattedMessage id="asset.purpose" /></Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.purpose }} />
      </AssetTabContentSectionContainer>
    )}
    {content?.timeliness && (
      <AssetTabContentSectionContainer>
        <Typography variant="h3" as="h2"><FormattedMessage id="asset.timeliness" /></Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.timeliness }} />
      </AssetTabContentSectionContainer>
    )}
  </div>
)
