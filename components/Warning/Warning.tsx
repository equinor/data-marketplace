/* eslint-disable camelcase */
import { Banner, Icon } from "@equinor/eds-core-react"
import { warning_filled } from "@equinor/eds-icons"
import React, { FunctionComponent } from "react"
import styled from "styled-components"

const BannerContainer = styled.div`
  display: flex;
  justify-content: center;
  line-height: 24px;
  padding: 20px 0;
  border-radius: 4px;
  border-color: black
  margin-bottom: 1rem;
  width: 600px;
  margin-left: 550px;
  padding-left: 20px;
  height: ${(props) => (props.id === "warning" ? "275px"
    : "200px")};
  background-color: ${(props) => (props.id === "warning" ? "#FFE7D6"
    : "#FFC1C1")};
     `

const TermsView: FunctionComponent = () => (
  <Banner>
    <BannerContainer>
      <p>
        <Icon data={warning_filled} color="#b20000" />
        <b> Security Classification</b>
        <br />
        <text> Restricted</text>
        <br />
        <br />
        <b>Sharing</b>
        <br />
        <text>
          Data from these Data Products can only be shared with restricted groups within Equinor.
          External sharing is prohibited
        </text>
      </p>
    </BannerContainer>
  </Banner>
)

const Cart: FunctionComponent = () => (
  <BannerContainer>
    <p>
      <Icon data={warning_filled} color="#b45f06" />
      <b>Access to these data products requires a VPN connection</b>
    </p>
  </BannerContainer>
)

type Props = {
  variant: string
}

export const Warning: FunctionComponent<Props> = ({ variant }) => {
  const component = variant === "warning" ? <TermsView /> : <Cart />
  return (
    <p>
      {component}
    </p>
  )
}
