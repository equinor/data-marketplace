import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { ResponsibilitiesHolderList, ResponsibilityHolder } from "./ResponsibilitiesHolderList"

import { Heading } from "components/Typography"

export type ResponsibilitiesContentSections = Record<string, ResponsibilityHolder[]>

const Responsibilities = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: ${tokens.spacings.comfortable.xx_large};
`
const Intro = styled.div`
  margin-bottom: ${tokens.spacings.comfortable.xx_large};
  max-width: 60ch;
`
const ResponsibilitiesWrapper = styled.div`
  padding-top: ${tokens.spacings.comfortable.x_large};
`

type Props = {
  content?: ResponsibilitiesContentSections
}

export const ResponsibilitiesContent = ({ content }: Props) => {
  const intl = useIntl()

  return (
    <ResponsibilitiesWrapper>
      <Intro>
        <Heading style={{ marginBottom: tokens.spacings.comfortable.small }} level="h2" size="xl">
          {intl.formatMessage({ id: "responsibility.intro.header" })}
        </Heading>
        <Typography variant="body_long">{intl.formatMessage({ id: "responsibility.intro.ingress" })}</Typography>
      </Intro>
      <Responsibilities>
        {content?.DATA_STEWARD && <ResponsibilitiesHolderList headline="Data steward" holders={content.DATA_STEWARD} />}
        {content?.TECHNICAL_STEWARD && (
          <ResponsibilitiesHolderList headline="Technical steward" holders={content.TECHNICAL_STEWARD} />
        )}
      </Responsibilities>
    </ResponsibilitiesWrapper>
  )
}
