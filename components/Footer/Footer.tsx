import { Typography } from "@equinor/eds-core-react"
import { tokens } from "@equinor/eds-tokens"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Container } from "../Container"

const FooterWrapper = styled.div`
  margin-top:  auto;
  padding-top: ${tokens.spacings.comfortable.xxx_large}
`

const TopBorderBox = styled.div`
  box-shadow: 0px -1px 0px #DCDCDC;
`

const StyledFooter = styled.footer`
  padding: 2rem 0;
  @media (min-width: 40rem) {
    padding: 4rem 0;
  }
`

export const Footer = () => {
  const intl = useIntl()
  return (
    <FooterWrapper>
      <TopBorderBox>
        <Container>
          <StyledFooter>
            <Typography variant="body_short">
              {intl.formatMessage({ id: "footer.copyright" })}
            </Typography>
          </StyledFooter>
        </Container>
      </TopBorderBox>
    </FooterWrapper>
  )
}
