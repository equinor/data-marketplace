/* eslint-disable camelcase */
import { Icon } from "@equinor/eds-core-react"
import { warning_filled } from "@equinor/eds-icons"
import { FunctionComponent } from "react"

type Props = {
  variant: string
}

export const Banner: FunctionComponent<Props> = ({ variant, children }) => {
  const classNames = [
    "banner",
    variant === "danger" ? "banner--danger" : "banner--warning",
  ]
    .join(" ")

  return (
    <div className={classNames}>
      <div className="banner_icon"><Icon color={variant === "danger" ? "#cc0000" : "#AD6200"} data={warning_filled} /></div>
      <div className="banner_container">{children}</div>
    </div>
  )
}
