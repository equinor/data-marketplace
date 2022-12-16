/* eslint-disable camelcase */
import { Typography, Icon } from "@equinor/eds-core-react"
import { external_link } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { PortableText } from "@portabletext/react"
import { FunctionComponent, PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { AssetTabContentSectionContainer } from "./AssetTabContentSectionContainer"

import { defaultComponents } from "htmlParsing/portableText"

const Overview = styled.div`
  padding-top: ${tokens.spacings.comfortable.x_large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacings.comfortable.x_large};
  max-width: 70ch;
`

const IconLink = styled.a`
  display: inline-flex;
  text-decoration: none;
  align-items: center;
  gap: 2px;
  &:hover {
    text-decoration: underline;
  }
`

export type OverviewContentSections = Pick<DataMarketplace.Asset, "description" | "updateFrequency">

type Props = {
  content: OverviewContentSections
  assetId: string
  collibraBaseUrl: string
}

const OverviewSubTitle: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2">
    {children}
  </Typography>
)

export const OverviewContent = ({ content, assetId, collibraBaseUrl }: Props) => {
  const { description, updateFrequency } = content
  const collibraUrl = `${collibraBaseUrl}/asset/${assetId}`
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
      <IconLink href={collibraUrl}>
        <FormattedMessage id="asset.view.in.collibra" />
        <Icon data={external_link} size={16} />
      </IconLink>
    </Overview>
  )
}
