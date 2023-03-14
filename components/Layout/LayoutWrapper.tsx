"use client"

import { FunctionComponent, PropsWithChildren } from "react"
import styled from "styled-components"

const StyledLayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &:has(.background-highlight:last-child) {
    background-color: var(--highlight-colour);
  }
`

export const LayoutWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <StyledLayoutWrapper>{children}</StyledLayoutWrapper>
)
