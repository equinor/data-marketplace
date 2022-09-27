import { Typography, List, Icon } from "@equinor/eds-core-react"
import { github, slack } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { useIntl } from "react-intl"
import styled from "styled-components"

const FOOTER_HEIGHT = "10rem"

const FooterWrapper = styled.div`
  min-height: calc(${FOOTER_HEIGHT} + ${tokens.spacings.comfortable.xxx_large});
  margin-top:  auto;
  padding-top: ${tokens.spacings.comfortable.xxx_large};
`

const UnstyledList = styled(List)`
  padding: 0;
  list-style: none;
`

const FooterContainer = styled.div`
  background-color: ${tokens.colors.infographic.primary__slate_blue.hex};
  height: ${FOOTER_HEIGHT};
  display: grid;
  align-items: center;
`

const InvertedText = styled(Typography)`
   color: ${tokens.colors.ui.background__default.hex}; 
`

const FooterLink = styled(List.Item)`
   color: ${tokens.colors.ui.background__default.hex}; 
   &:not(:last-child) {
     margin-bottom: ${tokens.spacings.comfortable.small};
   }
  @media screen and (min-width: 550px) {
    &:not(:last-child) {
      margin-bottom: ${tokens.spacings.comfortable.medium};
    }
  }
`

const Link = styled.a`
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  gap: ${tokens.spacings.comfortable.small};
  &:hover {
    text-decoration: underline;
  }
  @media screen and (min-width: 550px) {
    justify-content: flex-end;
  }
`

const FooterContent = styled.footer`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-inline: var(--layout-padding-inline);
  max-width: var(--layout-max-width);
  margin-inline: auto;
  gap: ${tokens.spacings.comfortable.x_large};
  @media screen and (min-width: 550px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

export const Footer = () => {
  const intl = useIntl()
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterContent>
          <InvertedText variant="body_short">
            {intl.formatMessage({ id: "footer.copyright" })}
          </InvertedText>
          <UnstyledList>
            <FooterLink>
              <Link href="https://equinor.slack.com/archives/C041CV62HRR">
                {intl.formatMessage({ id: "footer.feedback" })}
                <Icon data={slack} />
              </Link>

            </FooterLink>
            <FooterLink>
              <Link href="https://github.com/equinor/data-marketplace">
                {intl.formatMessage({ id: "footer.maintained" })}
                <Icon data={github} />
              </Link>
            </FooterLink>
          </UnstyledList>
        </FooterContent>
      </FooterContainer>
    </FooterWrapper>
  )
}
