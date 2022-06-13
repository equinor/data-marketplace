import { VoidFunctionComponent } from "react"

import { OverviewContent, OverviewContentSections } from "./OverviewContent"
import { ResponsibilitiesContent, ResponsibilitiesContentSections } from "./ResponsibilitiesContent"
import { AssetTabs } from "./types"

type Props = {
  tab: AssetTabs
  data: OverviewContentSections | ResponsibilitiesContentSections
}

export const AssetTabContent: VoidFunctionComponent<Props> = ({ tab, data }) => {
  switch (tab) {
    case AssetTabs.Overview:
      return <OverviewContent content={data as OverviewContentSections} />
    case AssetTabs.Responsibilities:
      return <ResponsibilitiesContent content={data as ResponsibilitiesContentSections} />
    default:
      return null
  }
}
