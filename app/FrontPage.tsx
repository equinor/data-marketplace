"use client"

import { FunctionComponent } from "react"

import { Hero } from "./Hero"

import { BrowseSpecificBusinessArea } from "components/BrowseSpecificBusinessArea"
import { Container } from "components/Container"
import { RelevantDataInformation } from "components/RelevantDataInformation"

type Props = {
  indexName: string
}

export const FrontPage: FunctionComponent<Props> = ({ indexName }) => (
  <>
    <Hero />
    <Container highlight>
      <BrowseSpecificBusinessArea indexName={indexName} />
    </Container>
    <Container highlight>
      <RelevantDataInformation />
    </Container>
  </>
)
