import { Typography, Button, Icon } from "@equinor/eds-core-react"
import { lock } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import type { NextPage, GetServerSideProps } from "next/types"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Page } from "components/Page"
import { Section } from "components/Section"
import { SigninInformationDialog } from "components/SigninInformationDialog"

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
  margin-block: ${tokens.spacings.comfortable.x_large};
`

type Props = {
  firstTimeVisitor: string
}

const SignIn: NextPage<Props> = () => {
  const intl = useIntl()
  const { query } = useRouter()

  const callbackUrl = (query.callbackUrl as string) || "/"
  return (
    <Page documentTitle={intl.formatMessage({ id: "auth.signin.document.title" })}>
      <Section>
        <Information>
          <CenteredText variant="h1">
            <FormattedMessage id="auth.signin.title" values={{ linebreak: <br /> }} />
          </CenteredText>

          <StyledButton onClick={() => signIn("azure-ad", { callbackUrl })}>
            <Icon data={lock} />
            <FormattedMessage id="auth.signin.c2a" />
          </StyledButton>
          <Typography variant="h5" as="h2" style={{ textAlign: "center" }}>
            <FormattedMessage id="auth.signin.first.time.visiting1" values={{ linebreak: <br /> }} />
          </Typography>
          <SigninInformationDialog />
        </Information>
      </Section>
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
