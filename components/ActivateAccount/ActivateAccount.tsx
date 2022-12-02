import { Typography, Button, Dialog } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useState, FunctionComponent } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

const { Header, Title, CustomContent, Actions } = Dialog

const CenteredText = styled(Typography)`
  text-align: center;
`

const SpacedTypography = styled(Typography)`
  &:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const OpenDialog = styled(Button)`
  margin-top: ${tokens.spacings.comfortable.small};
`

const DialogBox = styled(Dialog)`
  width: clamp(25ch, 60vw, 600px) !important;
`

type Props = {
  activateLink: string
}

export const ActivateAccount: FunctionComponent<Props> = ({ activateLink }) => {
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
      <CenteredText variant="body_short">
        <OpenDialog variant="ghost" aria-haspopup="dialog" onClick={handleOpen}>
          {intl.formatMessage({ id: "auth.signin.activate.account.dialog.button.text" })}
        </OpenDialog>
      </CenteredText>
      <DialogBox open={isOpen} isDismissable onClose={handleClose}>
        <Header>
          <Title>{intl.formatMessage({ id: "auth.signin.why.dialog.title" })}</Title>
        </Header>
        <CustomContent>
          <SpacedTypography variant="body_long">
            {intl.formatMessage({ id: "auth.signin.why.dialog.text1" })}
          </SpacedTypography>
          <SpacedTypography variant="body_long">
            {intl.formatMessage({ id: "auth.signin.why.dialog.text2" })}
          </SpacedTypography>
        </CustomContent>
        <Actions>
          <Button link href={activateLink} target="_blank" onClick={handleClose}>
            {intl.formatMessage({ id: "auth.signin.why.dialog.button.ok" })}
          </Button>
        </Actions>
      </DialogBox>
    </>
  )
}
