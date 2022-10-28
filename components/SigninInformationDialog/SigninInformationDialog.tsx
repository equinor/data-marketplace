import { Typography, Button, Dialog } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

const { Header, Title, CustomContent, Actions } = Dialog

const InformationDialog = styled(Typography)`
  margin-block: ${tokens.spacings.comfortable.xxx_large};
  display: inline-block;
  text-decoration: none;
`

export const SigninInformationDialog = () => {
  const intl = useIntl()
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }
  return (
    <>
      <InformationDialog aria-haspopup="dialog" link href="#" onClick={handleOpen}>
        <FormattedMessage id="auth.signin.why.signin" />
      </InformationDialog>
      <Dialog open={isOpen} isDismissable onClose={handleClose}>
        <Header>
          <Title>{intl.formatMessage({ id: "auth.signin.why.dialog.title" })}</Title>
        </Header>
        <CustomContent>
          <Typography variant="body_short">{intl.formatMessage({ id: "auth.signin.why.dialog.text" })}</Typography>
        </CustomContent>
        <Actions>
          <Button onClick={handleClose}>{intl.formatMessage({ id: "auth.signin.why.dialog.button.ok" })}</Button>
        </Actions>
      </Dialog>
    </>
  )
}
