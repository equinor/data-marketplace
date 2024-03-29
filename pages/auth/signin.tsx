import { Typography, Button, Icon } from "@equinor/eds-core-react"
import { lock } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { useRouter } from "next/router"
import type { NextPage, GetServerSideProps } from "next/types"
import { signIn } from "next-auth/react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { ActivateAccount } from "components/ActivateAccount"
import { Container } from "components/Container"
import { Page } from "components/Page"
import { Heading } from "components/Typography"

const Information = styled.div`
  width: min(33ch, 90%);
  margin: 0 auto;
  text-align: center;
`

const CenteredText = styled(Typography)`
  text-align: center;
  &:is(h1) {
    margin-block: ${tokens.spacings.comfortable.xx_large};
    word-break: break-word;
    hyphens: auto;
  }
`
const StyledButton = styled(Button)`
  margin-block: ${tokens.spacings.comfortable.x_large} ${tokens.spacings.comfortable.xxx_large};
`

type Props = {
  firstTimeVisitor: string
}

const SignIn: NextPage<Props> = ({ firstTimeVisitor }) => {
  const intl = useIntl()
  const { query } = useRouter()

  const callbackUrl = (query.callbackUrl as string) || "/"
  return (
    <Page documentTitle={intl.formatMessage({ id: "auth.signin.document.title" })}>
      <Container>
        <Information>
          <CenteredText variant="h1">
            <FormattedMessage id="auth.signin.title" values={{ linebreak: <br /> }} />
          </CenteredText>

          <StyledButton onClick={() => signIn("azure-ad", { callbackUrl })}>
            <Icon data={lock} />
            <FormattedMessage id="auth.signin.c2a" />
          </StyledButton>
          <Heading level="h5" size="xl" style={{ textAlign: "center" }}>
            <FormattedMessage id="auth.signin.first.time.visiting" values={{ linebreak: <br /> }} />
          </Heading>
          <ActivateAccount activateLink={firstTimeVisitor} />
        </Information>
      </Container>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    // This is not a secret, it's just an environment specific value.
    // It doesn't matter if we expose it to the client
    firstTimeVisitor: process.env.COLLIBRA_FIRST_TIME_VISITOR || "",
  },
})

export default SignIn
