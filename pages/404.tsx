/* eslint-disable camelcase */
import type { NextPage } from "next"
import styled from "styled-components"

import { Illustration } from "components/NotFound"
import { Page } from "components/Page"

const HeroIllustration = styled(Illustration)`
  align-items: center;
  
  > * {
   grid-area: hero;
 }
  `

const PageNotFound: NextPage = () => (
  <Page>

    <HeroIllustration />
  </Page>
)

export default PageNotFound
