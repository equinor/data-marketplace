import { Typography, Button, Icon } from "@equinor/eds-core-react"
import { lock } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { signIn } from "next-auth/react"
import { useCallback, ReactNode } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Page } from "components/Page"
import { Section } from "components/Section"

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

const SignIn = () => {
  const intl = useIntl()

  const FormattedLink = useCallback(
    (chunks: ReactNode[]) => (
      <Typography link href="todo" target="_blank" rel="noopener noreferrer nofollow">
        {chunks}
      </Typography>
    ),
    []
  )
  return (
    <Page documentTitle={intl.formatMessage({ id: "auth.signin.title" })}>
      <Section>
        <Information>
          <CenteredText variant="h1">
            <FormattedMessage id="auth.signin.title" values={{ linebreak: <br /> }} />
          </CenteredText>
          <CenteredText variant="ingress">
            <FormattedMessage id="auth.signin.intro" />
          </CenteredText>
          <StyledButton onClick={() => signIn("azure-ad", { callbackUrl: "/" })}>
            <Icon data={lock} />
            <FormattedMessage id="auth.signin.c2a" />
          </StyledButton>
          <CenteredText variant="body_short">
            <FormattedMessage
              id="auth.signin.first.time.visiting"
              values={{
                a: FormattedLink,
                linebreak: <br />,
              }}
            />
          </CenteredText>
        </Information>
      </Section>
    </Page>
  )
}

export default SignIn