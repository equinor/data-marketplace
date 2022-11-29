import { Typography, List, Icon } from "@equinor/eds-core-react"
import { github, slack, IconData } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import { useIntl } from "react-intl"
import styled from "styled-components"

const FOOTER_HEIGHT = "10rem"

const FooterWrapper = styled.div`
  min-height: calc(${FOOTER_HEIGHT} + ${tokens.spacings.comfortable.xxx_large});
  margin-top: auto;
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

const teams: IconData = {
  name: "teams",
  prefix: "eds",
  height: "24",
  width: "24",
  svgPathData:
    "M 12.5 2 A 3 3 0 0 0 9.7109375 6.0957031 C 9.4816446 6.0387499 9.2457928 6 9 6 L 4 6 C 2.3550302 6 1 7.3550302 1 9 L 1 14 C 1 15.64497 2.3550302 17 4 17 L 7.0253906 17 C 7.2799928 19.795164 9.6406512 22 12.5 22 C 14.739615 22 16.65687 20.644619 17.513672 18.712891 C 17.974482 18.898435 18.476643 19 19 19 C 21.198153 19 23 17.198153 23 15 L 23 10 A 1.0001 1.0001 0 0 0 22 9 L 17 9 L 16 9 L 12 9 C 12 8.6159726 11.919307 8.2509806 11.785156 7.9121094 A 3 3 0 0 0 12.5 8 A 3 3 0 0 0 12.5 2 z M 19 4 A 2 2 0 0 0 19 8 A 2 2 0 0 0 19 4 z M 4 8 L 9 8 C 9.5650302 8 10 8.4349698 10 9 L 10 9.8320312 A 1.0001 1.0001 0 0 0 10 10.158203 L 10 14 C 10 14.56503 9.5650302 15 9 15 L 8.1679688 15 A 1.0001 1.0001 0 0 0 7.8417969 15 L 4 15 C 3.4349698 15 3 14.56503 3 14 L 3 9 C 3 8.4349698 3.4349698 8 4 8 z M 4 9 L 4 10 L 6 10 L 6 14 L 7 14 L 7 10 L 9 10 L 9 9 L 4 9 z M 12 11 L 16 11 L 16 16.5 C 16 16.654111 15.985718 16.821305 15.964844 16.988281 A 1.0001 1.0001 0 0 0 15.951172 17.070312 C 15.676646 18.741661 14.258517 20 12.5 20 C 10.717732 20 9.2865785 18.704468 9.0488281 16.994141 C 10.671132 16.96698 12 15.628248 12 14 L 12 11 z M 18 11 L 21 11 L 21 15 C 21 16.121847 20.121847 17 19 17 C 18.618316 17 18.276725 16.894523 17.984375 16.716797 C 17.987525 16.642351 18 16.576655 18 16.5 L 18 11 z",
}

export const Footer = () => {
  const intl = useIntl()
  return (
    <FooterWrapper>
      <FooterContainer>
        <FooterContent>
          <InvertedText variant="body_short">{intl.formatMessage({ id: "footer.copyright" })}</InvertedText>
          <UnstyledList>
            <FooterLink>
              <Link href="https://equinor.slack.com/archives/C041CV62HRR">
                {intl.formatMessage({ id: "footer.feedback" })}
                <Icon data={slack} />
              </Link>
            </FooterLink>
            <FooterLink>
              <Link href="someTeamsLink">
                {intl.formatMessage({ id: "footer.feedback" })}
                <Icon data={teams} />
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
