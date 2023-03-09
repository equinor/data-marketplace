/* eslint-disable camelcase */
import type { Asset } from "@equinor/data-marketplace-models"
import { Icon, Button, Divider } from "@equinor/eds-core-react"
import { chevron_down, chevron_up, external_link } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { PortableText } from "@portabletext/react"
import { FunctionComponent, PropsWithChildren, useState } from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { AssetTabContentSectionContainer } from "./AssetTabContentSectionContainer"

import { defaultComponents } from "components/PortableText"
import { Heading } from "components/Typography"

const Overview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${tokens.spacings.comfortable.x_large};
  max-width: 70ch;
`

const MoreInfoContainer = styled.div<{ alone: boolean }>`
  ${({ alone }) => alone && `margin-top: ${tokens.spacings.comfortable.medium};`}
`

const MoreInfoDisclosure = styled.div`
  padding-top: ${tokens.spacings.comfortable.medium_small};
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

export type OverviewContentSections = Pick<Asset, "description" | "updateFrequency" | "excerpt">

type Props = {
  content: OverviewContentSections
  assetId: string
  collibraBaseUrl: string
}

const OverviewSubTitle: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <Heading style={{ marginBottom: tokens.spacings.comfortable.small }} level="h2" size="xl">
    {children}
  </Heading>
)

export const OverviewContent = ({ content, assetId, collibraBaseUrl }: Props) => {
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState<boolean>(false)

  const { excerpt, description, updateFrequency } = content
  const collibraUrl = `${collibraBaseUrl}/asset/${assetId}`

  return (
    <Overview>
      {(excerpt || description) && (
        <AssetTabContentSectionContainer>
          <OverviewSubTitle>
            <FormattedMessage id="asset.description" />
          </OverviewSubTitle>

          {excerpt && (
            /* @ts-ignore: Look into the correct way of doing this */
            <PortableText value={excerpt} components={defaultComponents} />
          )}

          {description && (
            <MoreInfoContainer alone={Boolean(!excerpt && description)}>
              <Button
                data-action="disclosure"
                aria-controls="more-information"
                aria-expanded={isMoreInfoOpen}
                variant="outlined"
                onClick={() => setIsMoreInfoOpen(!isMoreInfoOpen)}
              >
                More information
                <Icon data={isMoreInfoOpen ? chevron_up : chevron_down} />
              </Button>

              {isMoreInfoOpen && (
                <MoreInfoDisclosure id="more-information" aria-hidden={!isMoreInfoOpen}>
                  <Divider variant="small" />
                  {/* @ts-ignore: Look into the correct way of doing this */}
                  <PortableText value={description} components={defaultComponents} />
                </MoreInfoDisclosure>
              )}
            </MoreInfoContainer>
          )}
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
