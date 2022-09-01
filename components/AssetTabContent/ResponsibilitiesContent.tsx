import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { ResponsibilitiesHolderList, ResponsibilityHolder } from "./ResponsibilitiesHolderList"

export type ResponsibilitiesContentSections = Record<"DATA_OFFICE_ADMIN" | "DATA_STEWARD" | "OWNER" | "TECHNICAL_STEWARD", ResponsibilityHolder[]>

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
  padding:  ${tokens.spacings.comfortable.x_large} 0;
`

type Props = {
  content?: ResponsibilitiesContentSections
}

export const ResponsibilitiesContent = ({ content }: Props) => {
  const intl = useIntl()

  return (

    <ResponsibilitiesWrapper>
      <Intro>
        <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2">
          {intl.formatMessage({ id: "responsibility.intro.header" })}
        </Typography>
        <Typography variant="body_long">
          {intl.formatMessage({ id: "responsibility.intro.ingress" })}
        </Typography>
      </Intro>
      <Responsibilities>
        {content?.DATA_STEWARD && (
          <ResponsibilitiesHolderList headline="Data stewards" holders={content.DATA_STEWARD} />
        )}
        {content?.TECHNICAL_STEWARD && (
          <ResponsibilitiesHolderList headline="Technical stewards" holders={content.TECHNICAL_STEWARD} />
        )}
        {content?.OWNER && (
          <ResponsibilitiesHolderList headline="Owners" holders={content.OWNER} />
        )}

        {content?.DATA_OFFICE_ADMIN && (
          <ResponsibilitiesHolderList headline="Data office admins" holders={content.DATA_OFFICE_ADMIN} />
        )}
      </Responsibilities>
    </ResponsibilitiesWrapper>
  )
}
