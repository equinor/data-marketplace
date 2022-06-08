import { VoidFunctionComponent } from "react"

import { OverviewContent, OverviewContentSections } from "./OverviewContent"
import { AssetTabs } from "./types"

type Props = {
  tab: AssetTabs
  data: OverviewContentSections
}

export const AssetTabContent: VoidFunctionComponent<Props> = ({ tab, data }) => {
  switch (tab) {
    case AssetTabs.Overview:
      return <OverviewContent content={data} />
    case AssetTabs.Responsibilities:
      return <div />
    default:
      return null
  }
}
