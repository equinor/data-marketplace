import { Button } from "@equinor/eds-core-react"
import Link from "next/link"
import { FunctionComponent } from "react"
import { useIntl } from "react-intl"

import { useCheckoutData } from "../../hooks/useCheckoutData"

import type { AssetIdProp } from "./types"

export const CancelButton: FunctionComponent<AssetIdProp> = ({ assetId }) => {
  const intl = useIntl()

  const { removeItem } = useCheckoutData()

  const onCancel = () => {
    removeItem()
  }

  return (
    <Link href={{ pathname: "/assets/[id]", query: { id: assetId } }} passHref>
      <Button onClick={onCancel} variant="outlined" color="secondary" as="a">
        {intl.formatMessage({ id: "common.cancel" })}
      </Button>
    </Link>
  )
}
