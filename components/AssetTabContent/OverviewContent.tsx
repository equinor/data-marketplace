import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { PortableText } from "@portabletext/react"
import { FunctionComponent, PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { AssetTabContentSectionContainer } from "./AssetTabContentSectionContainer"

// import { config } from "config"
import { defaultComponents } from "htmlParsing/portableText"

const Overview = styled.div`
  padding-top: ${tokens.spacings.comfortable.x_large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacings.comfortable.x_large};
  max-width: 70ch;
`

export type OverviewContentSections = Pick<DataMarketplace.Asset, "description" | "updateFrequency">

type Props = {
  content: OverviewContentSections
}

const OverviewSubTitle: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2">
    {children}
  </Typography>
)

export const OverviewContent = ({ content }: Props) => {
  const { description, updateFrequency } = content

  return (
    <Overview>
      {description && (
        <AssetTabContentSectionContainer>
          <OverviewSubTitle>
            <FormattedMessage id="asset.description" />
          </OverviewSubTitle>
          {/* @ts-ignore: Look into the correct way of doing this */}
          <PortableText value={description} components={defaultComponents} />
        </AssetTabContentSectionContainer>
      )}
      {updateFrequency && (
        <AssetTabContentSectionContainer>
          <OverviewSubTitle>
            <FormattedMessage id="asset.timeliness" />
          </OverviewSubTitle>
          {/* @ts-ignore: Look into the correct way of doing this */}
          <PortableText value={updateFrequency} components={defaultComponents} />
        </AssetTabContentSectionContainer>
      )}
    </Overview>
  )
}
