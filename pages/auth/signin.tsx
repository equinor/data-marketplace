import { Typography, Button, Icon } from "@equinor/eds-core-react"
import { lock } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { signIn } from "next-auth/react"
import getConfig from "next/config"
import { useRouter } from "next/router"
import type { NextPage, GetServerSideProps } from "next/types"
import { useCallback, ReactNode } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Page } from "components/Page"
import { Section } from "components/Section"
import { SigninInformationDialog } from "components/SigninInformationDialog"

const { serverRuntimeConfig } = getConfig()

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

const SignIn: NextPage<Props> = ({ firstTimeVisitor }) => {
  const intl = useIntl()
  const { query } = useRouter()
  console.log("First time user", firstTimeVisitor, serverRuntimeConfig.firstTimeVisitor)

  const callbackUrl = (query.callbackUrl as string) || "/"

  const FormattedLink = useCallback(
    (chunks: ReactNode[]) => (
      <Typography link href={firstTimeVisitor} target="_blank" rel="noopener noreferrer nofollow">
        {chunks}
      </Typography>
    ),
    []
  )
  return (
    <Page documentTitle={intl.formatMessage({ id: "auth.signin.document.title" })}>
      <Section>
        <Information>
          <CenteredText variant="h1">
            <FormattedMessage id="auth.signin.title" values={{ linebreak: <br /> }} />
          </CenteredText>
          <CenteredText variant="ingress">
            <FormattedMessage id="auth.signin.intro" />
          </CenteredText>
          <StyledButton onClick={() => signIn("azure-ad", { callbackUrl })}>
            <Icon data={lock} />
            <FormattedMessage id="auth.signin.c2a" />
          </StyledButton>
          <CenteredText variant="body_short">
            <FormattedMessage
              id="auth.signin.first.time.visiting"
              values={{
                a: FormattedLink,
              }}
            />
          </CenteredText>
          <SigninInformationDialog />
        </Information>
      </Section>
    </Page>
  )
}

export const getServerSideProps: GetServerSideProps = async () => ({
  props: {
    firstTimeVisitor: serverRuntimeConfig.firstTimeVisitor,
  },
})

export default SignIn
