import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { FunctionComponent, PropsWithChildren } from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { AssetTabContentSectionContainer } from "./AssetTabContentSectionContainer"

import { getPortableText } from "htmlParsing/descriptionTest"

const Overview = styled.div`
  padding-top: ${tokens.spacings.comfortable.x_large};
  display: flex;
  flex-direction: column;
  gap: ${tokens.spacings.comfortable.x_large};
  max-width: 70ch;
`

export type OverviewContentSections = Pick<DataMarketplace.Asset, "description" | "updateFrequency">

type Props = {
  content?: OverviewContentSections
}

const OverviewSubTitle: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2">
    {children}
  </Typography>
)

export const OverviewContent = ({ content }: Props) => {
  const usePortableText = process.env.NEXT_PUBLIC_USE_PORTABLE_TEXT === "true"

  let testText = []
  if (usePortableText && window !== undefined) {
    testText = content && content.description && getPortableText(content?.description)
  }
  return (
    <Overview>
      {content?.description && (
        <AssetTabContentSectionContainer>
          <OverviewSubTitle><FormattedMessage id="asset.description" /></OverviewSubTitle>
          <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.description }} />
        </AssetTabContentSectionContainer>
      )}
      {content?.updateFrequency && (
        <AssetTabContentSectionContainer>
          <OverviewSubTitle><FormattedMessage id="asset.timeliness" /></OverviewSubTitle>
          <Typography variant="body_long" dangerouslySetInnerHTML={{ __html: content.updateFrequency }} />
        </AssetTabContentSectionContainer>
      )}
      {usePortableText && (
        <div>
          <h2>Portable text version of the description</h2>
          <ol>
            {/* eslint-disable-next-line react/no-array-index-key */}
            {testText.map((block: any, idx: any) => <li key={idx}>{JSON.stringify(block)}</li>)}
          </ol>
        </div>
      )}
    </Overview>
  )
}
