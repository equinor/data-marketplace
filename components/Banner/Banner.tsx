/* eslint-disable camelcase */
import { Icon, Typography } from "@equinor/eds-core-react"
import { warning_filled } from "@equinor/eds-icons"
import { FunctionComponent, ReactNode } from "react"
import styled from "styled-components"

type Props = {
  variant: string
  children: ReactNode
}

const BannerContainer = styled.div<{ variant: string }>`
background-color: ${({ variant }) => (variant === "danger" ? "#FFC1C1"
    : "#FFE7D6")};
    display: flex;
    justify-content: start;
    gap: 15px;

`

const BannerIcon = styled.div<{ variant: string }>`
color: ${({ variant }) => (variant === "danger" ? "red"
    : "brown")};
    padding-left: 5px;

`

export const Banner: FunctionComponent<Props> = ({ variant, children }) => (
  <div>
    <BannerContainer variant={variant}>
      <BannerIcon variant={variant}>
        <Icon data={warning_filled} />
      </BannerIcon>
      <Typography>
        {children}
      </Typography>
    </BannerContainer>
  </div>
)
