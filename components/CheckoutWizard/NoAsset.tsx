/* eslint-disable camelcase */
import { Banner, Icon } from "@equinor/eds-core-react"
import {
  warning_outlined,
} from "@equinor/eds-icons"
import { useIntl } from "react-intl"

const { Message, Icon: BannerIcon } = Banner

export const NoAsset = () => {
  const intl = useIntl()
  return (
    <Banner elevation="raised">
      <BannerIcon variant="warning">
        <Icon data={warning_outlined} />
      </BannerIcon>
      <Message>{intl.formatMessage({ id: "checkout.no.asset" })}</Message>
    </Banner>
  )
}
