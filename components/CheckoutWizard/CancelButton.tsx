import { Button } from "@equinor/eds-core-react"
import Link from "next/link"
import { FunctionComponent } from "react"
import { useIntl } from "react-intl"

import type { AssetIdProp } from "./types"

export const CancelButton: FunctionComponent<AssetIdProp> = ({ assetId }) => {
  const intl = useIntl()

  return (
    <Link href={{ pathname: "/assets/[id]", query: { id: assetId } }} passHref>
      <Button variant="outlined" color="secondary" as="span">
        {intl.formatMessage({ id: "common.cancel" })}
      </Button>
    </Link>
  )
}
