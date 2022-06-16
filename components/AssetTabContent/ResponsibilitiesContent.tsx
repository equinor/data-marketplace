import { VoidFunctionComponent } from "react"
import styled from "styled-components"

import { ResponsibilitiesHolderList, ResponsibilityHolder } from "./ResponsibilitiesHolderList"

const ResponsibilitiesContentContainer = styled.div`
  > *:not(:last-child) {
    margin-bottom: 2.5rem;
  }
`

export type ResponsibilitiesContentSections = Record<"DATA_OFFICE_ADMIN" | "DATA_STEWARD" | "OWNER" | "TECHNICAL_STEWARD", ResponsibilityHolder[]>

type Props = {
  content?: ResponsibilitiesContentSections
}

export const ResponsibilitiesContent: VoidFunctionComponent<Props> = ({ content }) => (
  <ResponsibilitiesContentContainer>
    {content?.DATA_STEWARD && (
      <ResponsibilitiesHolderList headline="Data stewards" holders={content.DATA_STEWARD} />
    )}

    {content?.OWNER && (
      <ResponsibilitiesHolderList headline="Owners" holders={content.OWNER} />
    )}

    {content?.DATA_OFFICE_ADMIN && (
      <ResponsibilitiesHolderList headline="Data office admins" holders={content.DATA_OFFICE_ADMIN} />
    )}

    {content?.TECHNICAL_STEWARD && (
      <ResponsibilitiesHolderList headline="Technical stewards" holders={content.TECHNICAL_STEWARD} />
    )}
  </ResponsibilitiesContentContainer>
)
