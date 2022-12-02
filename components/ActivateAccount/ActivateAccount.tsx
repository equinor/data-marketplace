import { Typography, Button, Dialog } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useState } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { config } from "config"

const { Header, Title, CustomContent, Actions } = Dialog

const CenteredText = styled(Typography)`
  text-align: center;
  &:is(h1) {
    margin-block: ${tokens.spacings.comfortable.xx_large};
    word-break: break-word;s
    hyphens: auto;
  }
`

const OpenDialog = styled(Button)`
  margin-top: ${tokens.spacings.comfortable.small};
`

const DialogBox = styled(Dialog)`
  top: 50%;
  left: 50%;
  line-height: 26px;
  width: 40%;
  maxwidth: 768px;
  height: 250px;
  text-decoration: none;
`

export const ActivateAccount = () => {
  const intl = useIntl()
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }
  const handleClose = () => {
    setIsOpen(false)
  }

  const collibraUrl = config.COLLIBRA_BASE_URL as string
  return (
    <>
      <CenteredText variant="body_short">
        <OpenDialog variant="ghost" aria-haspopup="dialog" onClick={handleOpen}>
          {intl.formatMessage({ id: "auth.signin.activate.account" })}
        </OpenDialog>
      </CenteredText>
      <DialogBox open={isOpen} isDismissable onClose={handleClose}>
        <Header>
          <Title>{intl.formatMessage({ id: "auth.signin.why.dialog.title" })}</Title>
        </Header>
        <CustomContent>
          <Typography variant="body_short">{intl.formatMessage({ id: "auth.signin.why.dialog.text1" })}</Typography>
          <br />
          <Typography variant="body_short">{intl.formatMessage({ id: "auth.signin.why.dialog.text2" })}</Typography>
        </CustomContent>
        <Actions>
          <Button href={collibraUrl} target="_blank" onClick={handleClose}>
            {intl.formatMessage({ id: "auth.signin.why.dialog.button.ok" })}
          </Button>
        </Actions>
      </DialogBox>
    </>
  )
}
