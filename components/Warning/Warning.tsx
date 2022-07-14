/* eslint-disable camelcase */
import { Banner } from "@equinor/eds-core-react"
import React, { FunctionComponent } from "react"
import styled from "styled-components"

const BannerContainer = styled.div`
  display: flex;
  justify-content: center;
  font-style: sans-serif;
  padding: 20px 0;
  height: 172px;
  margin-bottom: 1rem;
  width: 600px;
  margin-left: 550px;
  padding-left: 20px;
  background-color: ${(props) => (props.id === "warning" ? "#FFE7D6"
    : "#FFC1C1")};
     `

const TermsView: FunctionComponent = () => (
  <div>
    <Banner>
      <BannerContainer>
        <Banner.Icon variant="warning" />
        <p>
          <b> Security Classification</b>
          <br />
          <text>Restricted</text>
          <br />
          {" "}
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
  </div>
)

const Cart: FunctionComponent = () => (
  <BannerContainer>
    <Banner.Icon variant="info" />
    <p>
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
    <BannerContainer>
      {component}
    </BannerContainer>
  )
}
