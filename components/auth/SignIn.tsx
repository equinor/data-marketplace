import { Typography, Button } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { signIn } from "next-auth/react"
import { useCallback, ReactNode } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import styled from "styled-components"

import { Page } from "components/Page"
import { Section } from "components/Section"

const Information = styled.div`
  max-width: 20rem;
  margin: 0 auto;
  text-align: center;
`

const CenteredText = styled(Typography)`
  text-align: center;
`
const StyledButton = styled(Button)`
  margin-block: ${tokens.spacings.comfortable.x_large};
`

export const SignIn = () => {
  const intl = useIntl()

  const FormattedLink = useCallback(
    (chunks: ReactNode[]) => (
      <Typography link href="ff" target="_blank" rel="noopener noreferrer nofollow">
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

          <StyledButton onClick={() => signIn("azure-ad")}>
            <FormattedMessage id="auth.signin.c2a" />
          </StyledButton>
          <CenteredText variant="body_long">
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
