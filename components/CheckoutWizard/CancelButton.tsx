import { Button } from "@equinor/eds-core-react"
import Link from "next/link"
import { FunctionComponent } from "react"
import { useIntl } from "react-intl"

import type { AssetIdProp } from "./types"

export const CancelButton: FunctionComponent<AssetIdProp> = ({ assetId }) => {
  const intl = useIntl()

  return (
    /*  Because EDS types href as string */
    /* @ts-ignore */
    <Button variant="outlined" color="secondary" as={Link} href={{ pathname: "/assets/[id]", query: { id: assetId } }}>
      {intl.formatMessage({ id: "common.cancel" })}
    </Button>
  )
}
