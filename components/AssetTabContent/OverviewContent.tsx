import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { FunctionComponent, PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { AssetTabContentSectionContainer } from "./AssetTabContentSectionContainer"

const Overview = styled.div`
  padding-top: ${tokens.spacings.comfortable.x_large};
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

const OverviewSubTitle: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2">
    {children}
  </Typography>
)

export const OverviewContent = ({ content }: Props) => (
  <Overview>
    {content?.description && (
      <AssetTabContentSectionContainer>
        <OverviewSubTitle><FormattedMessage id="asset.description" /></OverviewSubTitle>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.description }} />
      </AssetTabContentSectionContainer>
    )}
    {content?.purpose && (
      <AssetTabContentSectionContainer>
        <OverviewSubTitle><FormattedMessage id="asset.purpose" /></OverviewSubTitle>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.purpose }} />
      </AssetTabContentSectionContainer>
    )}
    {content?.timeliness && (
      <AssetTabContentSectionContainer>
        <OverviewSubTitle><FormattedMessage id="asset.timeliness" /></OverviewSubTitle>
        <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.timeliness }} />
      </AssetTabContentSectionContainer>
    )}
  </Overview>
)
