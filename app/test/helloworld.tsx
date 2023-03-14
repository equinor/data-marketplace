"use client"

import { FunctionComponent } from "react"
import { FormattedMessage } from "react-intl"
import styled from "styled-components"

import { Container } from "components/Container"
import { Heading } from "components/Typography"

const PostItem = styled.span`
  color: pink;
  background-color: cadetblue;
  letter-spacing: 0.3rem;
  display: inline-block;
  margin-right: 0.5rem;
  padding: 1rem;
  font-size: 2rem;
`

type Post = {
  name: string
}
type Props = {
  recentPosts: Post[]
}
// This is a Client Component. It receives data as props and
// has access to state and effects just like Page components
// in the `pages` directory.
export const HelloWorld: FunctionComponent<Props> = ({ recentPosts }) => (
  <Container>
    <Heading size="2xl" level="h1" bold>
      Hello from the app folder
    </Heading>
    <FormattedMessage id="frontpage.browseSpecificBusinessArea.header" />

    <div>
      {recentPosts.map((post) => (
        <PostItem key={post.name}>{post.name}</PostItem>
      ))}
    </div>
  </Container>
)
