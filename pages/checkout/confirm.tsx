import { Button, Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import type { NextPage } from "next"
import { useIntl } from "react-intl"
import { useSelector } from "react-redux"
import styled from "styled-components"

import { CheckoutWizard } from "../../components/CheckoutWizard/CheckoutWizard"
import { Container } from "../../components/Container"
import type { RootState } from "../../store"

const ContentContainer = styled.div`
  > *:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`

const QuoteContainer = styled.div`
  > p {
    margin-bottom: 0.5rem;
  }
`

const Quote = styled.blockquote`
  margin: 0;
  padding: 0.5rem 0;
  padding-left: 1rem;
  border-left: 2px solid ${tokens.colors.text.static_icons__tertiary.hex};
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`

const CheckoutConfirmView: NextPage = () => {
  const intl = useIntl()
  const state = useSelector((rootState: RootState) => rootState.checkout)

  return (
    <Container>
      <CheckoutWizard>
        <ContentContainer>
          <Typography>
            {intl.formatMessage({ id: "checkout.confirm.terms" })}
          </Typography>

          {/* TODO: Add data products */}

          <QuoteContainer>
            <Typography>
              {intl.formatMessage({ id: "checkout.confirm.description" })}
            </Typography>
            <Quote>
              <Typography>{state.data.access?.description}</Typography>
            </Quote>
          </QuoteContainer>

          <ButtonContainer>
            <Button variant="outlined" color="secondary">
              {intl.formatMessage({ id: "common.cancel" })}
            </Button>
            <Button>
              {intl.formatMessage({ id: "common.confirm" })}
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </CheckoutWizard>
    </Container>
  )
}

export default CheckoutConfirmView
