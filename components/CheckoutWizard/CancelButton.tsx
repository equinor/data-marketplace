import { Button } from "@equinor/eds-core-react"
import { FunctionComponent } from "react"
import { useIntl } from "react-intl"

import { Link } from "../Link"

import type { AssetIdProp } from "./types"

export const CancelButton: FunctionComponent<AssetIdProp> = ({ assetId }) => {
  const intl = useIntl()

  return (
    <Link href={{ pathname: "/assets/[id]", query: { id: assetId } }}>
      <Button variant="outlined" color="secondary" as="a">
        {intl.formatMessage({ id: "common.cancel" })}
      </Button>
    </Link>
  )
}
