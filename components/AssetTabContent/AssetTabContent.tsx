import { OverviewContent, OverviewContentSections } from "./OverviewContent"
import { ResponsibilitiesContent, ResponsibilitiesContentSections } from "./ResponsibilitiesContent"
import { AssetTabs } from "./types"

type Props = {
  tab: AssetTabs
  data: OverviewContentSections | ResponsibilitiesContentSections
}

export const AssetTabContent = ({ tab, data }: Props) => {
  switch (tab) {
    case AssetTabs.Overview:
      return <OverviewContent content={data as OverviewContentSections} />
    case AssetTabs.Responsibilities:
      return <ResponsibilitiesContent content={data as ResponsibilitiesContentSections} />
    default:
      return null
  }
}
