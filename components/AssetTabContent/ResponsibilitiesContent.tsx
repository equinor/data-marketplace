import { VoidFunctionComponent } from "react"
import styled from "styled-components"

import { ResponsibilitiesHolderList, ResponsibilityHolder } from "./ResponsibilitiesHolderList"

const ResponsibilitiesContentContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1.5rem;
`

export type ResponsibilitiesContentSections = Record<"DATA_OFFICE_ADMIN" | "DATA_STEWARD" | "OWNER" | "TECHNICAL_STEWARD", ResponsibilityHolder[]>

type Props = {
  content?: ResponsibilitiesContentSections
}

export const ResponsibilitiesContent: VoidFunctionComponent<Props> = ({ content }) => (
  <ResponsibilitiesContentContainer>
    {content?.OWNER && (
      <ResponsibilitiesHolderList headline="Owner" holders={content.OWNER} />
    )}

    {content?.DATA_STEWARD && (
      <ResponsibilitiesHolderList headline="Data steward" holders={content.DATA_STEWARD} />
    )}

    {content?.DATA_OFFICE_ADMIN && (
      <ResponsibilitiesHolderList headline="Data office admin" holders={content.DATA_OFFICE_ADMIN} />
    )}

    {content?.TECHNICAL_STEWARD && (
      <ResponsibilitiesHolderList headline="Technical steward" holders={content.TECHNICAL_STEWARD} />
    )}
  </ResponsibilitiesContentContainer>
)
