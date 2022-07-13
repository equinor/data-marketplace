/* eslint-disable camelcase */
import { Banner, Icon } from "@equinor/eds-core-react"
import React from "react"
import styled from "styled-components"
import { FunctionComponent, useEffect, useState } from "react"
import { warning_filled } from "@equinor/eds-icons"

const TermsView: FunctionComponent = () => {
  return (
    <div>
    <Banner>
      <BannerContainer>
      <Banner.Icon variant="warning">
      </Banner.Icon>
     <p><b> Security Classification</b>
     <br/>
     <text>Restricted</text>
     <br/> <br/>
     <b>Sharing</b>
     <br/>
     <text>Data from these Data Products can only be shared with restricted groups within Equinor. External sharing is prohibited</text>
     </p>
      </BannerContainer>
    </Banner>
    </div>
  )
}

const Cart: FunctionComponent = () => {
  return (
    <BannerContainer>
      <Banner.Icon variant="info">
       
      </Banner.Icon>
      <p><b>Access to these data products requires a VPN connection</b>
     </p>
    </BannerContainer>
  )
}


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
  background-color: ${props =>
    props.id === 'warning' ? '#FFE7D6'
      : '#FFC1C1'};
     `

type Props = {
  variant: string
}

export const Warning: FunctionComponent<Props> = ({ variant }) => {
  const component = variant == "warning" ? <TermsView /> : <Cart />
  return (
    <>
       {component}
    </>
  );
}