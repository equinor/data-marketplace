import { Typography } from "@equinor/eds-core-react"
import { VoidFunctionComponent } from "react"

import { AssetTabContentSectionContainer } from "./AssetTabContentSectionContainer"

export type OverviewContentSections = {
  description?: string
  purpose?: string
  timeliness?: string
}

type Props = {
  content?: OverviewContentSections
}

export const OverviewContent: VoidFunctionComponent<Props> = ({ content }) => (
  <div>
    {content?.description && (
      <AssetTabContentSectionContainer>
        <Typography variant="h3" as="h2">Description</Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.description }} />
      </AssetTabContentSectionContainer>
    )}
    {content?.purpose && (
      <AssetTabContentSectionContainer>
        <Typography variant="h3" as="h2">Purpose</Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.purpose }} />
      </AssetTabContentSectionContainer>
    )}
    {content?.timeliness && (
      <AssetTabContentSectionContainer>
        <Typography variant="h3" as="h2">Timeliness</Typography>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.timeliness }} />
      </AssetTabContentSectionContainer>
    )}
  </div>
)
