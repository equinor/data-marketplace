import { Typography } from "@equinor/eds-core-react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Container } from "../Container"

const FooterWrapper = styled.div`
  box-shadow: 0px -1px 0px #DCDCDC;
  margin-top: auto;
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
      <Container>
        <StyledFooter>
          <Typography variant="body_short">
            {intl.formatMessage({ id: "footer.copyright" })}
          </Typography>
        </StyledFooter>
      </Container>
    </FooterWrapper>
  )
}
