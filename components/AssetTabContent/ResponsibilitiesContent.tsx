import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
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

export const ResponsibilitiesContent = ({ content }: Props) => (

  <ResponsibilitiesWrapper>
    <Intro>
      <Typography style={{ marginBottom: tokens.spacings.comfortable.small }} variant="h3" as="h2">Get in touch</Typography>
      <Typography variant="body_long">Have a question about this data product? Get in touch with the data steward if you have any general questions. Technical questions or issues, contact the technical steward..</Typography>
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
