import { Typography, List, Icon } from "@equinor/eds-core-react"
import { github, IconData } from "@equinor/eds-icons"
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

const TopBorderBox = styled.div`
  box-shadow: 0px -1px 0px ${tokens.colors.ui.background__medium.hex};
  height: ${FOOTER_HEIGHT};
  display: grid;
  align-items: center;
`

const FooterLink = styled(List.Item)`
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
  gap: ${tokens.spacings.comfortable.small};
  &:hover {
    text-decoration: underline;
  }
  @media screen and (min-width: 550px) {
    justify-content: flex-end;
  }
`

const StyledFooter = styled.footer`
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

const slack: IconData = {
  name: "slack",
  prefix: "eds",
  height: "24",
  width: "24",
  svgPathData: "M4 12C4 12.5304 3.78929 13.0391 3.41421 13.4142C3.03914 13.7893 2.53043 14 2 14C1.46957 14 0.960859 13.7893 0.585786 13.4142C0.210714 13.0391 0 12.5304 0 12C0 11.4696 0.210714 10.9609 0.585786 10.5858C0.960859 10.2107 1.46957 10 2 10H4V12ZM5 12C5 11.4696 5.21071 10.9609 5.58579 10.5858C5.96086 10.2107 6.46957 10 7 10C7.53043 10 8.03914 10.2107 8.41421 10.5858C8.78929 10.9609 9 11.4696 9 12V17C9 17.5304 8.78929 18.0391 8.41421 18.4142C8.03914 18.7893 7.53043 19 7 19C6.46957 19 5.96086 18.7893 5.58579 18.4142C5.21071 18.0391 5 17.5304 5 17V12ZM7 4C6.46957 4 5.96086 3.78929 5.58579 3.41421C5.21071 3.03914 5 2.53043 5 2C5 1.46957 5.21071 0.960859 5.58579 0.585786C5.96086 0.210714 6.46957 0 7 0C7.53043 0 8.03914 0.210714 8.41421 0.585786C8.78929 0.960859 9 1.46957 9 2V4H7ZM7 5C7.53043 5 8.03914 5.21071 8.41421 5.58579C8.78929 5.96086 9 6.46957 9 7C9 7.53043 8.78929 8.03914 8.41421 8.41421C8.03914 8.78929 7.53043 9 7 9H2C1.46957 9 0.960859 8.78929 0.585786 8.41421C0.210714 8.03914 0 7.53043 0 7C0 6.46957 0.210714 5.96086 0.585786 5.58579C0.960859 5.21071 1.46957 5 2 5H7ZM15 7C15 6.46957 15.2107 5.96086 15.5858 5.58579C15.9609 5.21071 16.4696 5 17 5C17.5304 5 18.0391 5.21071 18.4142 5.58579C18.7893 5.96086 19 6.46957 19 7C19 7.53043 18.7893 8.03914 18.4142 8.41421C18.0391 8.78929 17.5304 9 17 9H15V7ZM14 7C14 7.53043 13.7893 8.03914 13.4142 8.41421C13.0391 8.78929 12.5304 9 12 9C11.4696 9 10.9609 8.78929 10.5858 8.41421C10.2107 8.03914 10 7.53043 10 7V2C10 1.46957 10.2107 0.960859 10.5858 0.585786C10.9609 0.210714 11.4696 0 12 0C12.5304 0 13.0391 0.210714 13.4142 0.585786C13.7893 0.960859 14 1.46957 14 2V7ZM12 15C12.5304 15 13.0391 15.2107 13.4142 15.5858C13.7893 15.9609 14 16.4696 14 17C14 17.5304 13.7893 18.0391 13.4142 18.4142C13.0391 18.7893 12.5304 19 12 19C11.4696 19 10.9609 18.7893 10.5858 18.4142C10.2107 18.0391 10 17.5304 10 17V15H12ZM12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10H17C17.5304 10 18.0391 10.2107 18.4142 10.5858C18.7893 10.9609 19 11.4696 19 12C19 12.5304 18.7893 13.0391 18.4142 13.4142C18.0391 13.7893 17.5304 14 17 14H12Z",
}

export const Footer = () => {
  const intl = useIntl()
  return (
    <FooterWrapper>
      <TopBorderBox>
        <StyledFooter>
          <Typography variant="body_short">
            {intl.formatMessage({ id: "footer.copyright" })}
          </Typography>
          <UnstyledList>
            <FooterLink>
              <Link href="https://github.com/equinor/data-marketplace">
                {intl.formatMessage({ id: "footer.feedback" })}
                <Icon data={slack} />
              </Link>

            </FooterLink>
            <FooterLink>
              <Link href="https://equinor.slack.com/archives/C041CV62HRR">
                {intl.formatMessage({ id: "footer.maintained" })}
                <Icon data={github} />
              </Link>
            </FooterLink>
          </UnstyledList>
        </StyledFooter>
      </TopBorderBox>
    </FooterWrapper>
  )
}
