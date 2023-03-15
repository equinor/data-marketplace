"use client"

import { Typography } from "@equinor/eds-core-react"
import { FunctionComponent } from "react"
import styled from "styled-components"

import { Heading } from "components/Typography"
import { elevations } from "styles/globals"

type StyledCardProps = {
  inactive: boolean
}

const StyledCard = styled.div<StyledCardProps>`
  height: 100%;
  background-color: var(--white);
  padding: var(--space-16);
  border-radius: var(--space-4);
  box-shadow: ${elevations.medium};
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${({ inactive }) =>
    inactive && {
      backgroundColor: "hsla(0, 0%, 92%, 1)",
    }}
`

const AnimatedArrow = styled.span`
  --arrow-colour: var(--moss-green-100);
  position: relative;
  display: inline;
  padding: 8px 0;
  align-self: flex-start;
  &:before {
    content: "";
    display: block;
    width: 28px;
    height: 2px;
    margin-right: 2px;
    background-color: var(--arrow-colour);
    top: 50%;
    will-change: transition;
    transition: width 450ms ease-out;
  }
  &:after {
    content: "";
    display: block;
    width: 10px;
    height: 10px;
    border-top: 2px solid var(--arrow-colour);
    border-right: 2px solid var(--arrow-colour);
    transform: rotate(45deg);
    top: calc(50% - 5px);
    position: absolute;
    right: 2px;
  }
  ${StyledCard}:hover & {
    cursor: pointer;
    &:before {
      width: 40px;
      transition: width 125ms;
      transition-delay: 250ms;
    }
  }
`

type Props = {
  header: string
  inactive?: boolean
  teaser?: string
}

export const BusinessAreaCard: FunctionComponent<Props> = ({ header, inactive = false, teaser }) => (
  <StyledCard inactive={inactive}>
    <Heading level="h3" size="lg" style={{ marginBottom: "var(--space-8)" }}>
      {header}
    </Heading>

    {inactive ? <Typography>{teaser}</Typography> : <AnimatedArrow />}
  </StyledCard>
)
