import { Typography } from "@equinor/eds-core-react"
import styled from "styled-components"

/* @TODO We need something more here as some content already is wrapped in a p tag or other tags */
export const TruncatedDescription = styled(Typography)<{ lines?: number }>`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ lines }) => (lines && lines > 0 ? lines : 4)};
  overflow: hidden;
`
