"use client"

import Head from "next/head"
import { useSession } from "next-auth/react"

import { Container } from "components/Container"
import { Heading } from "components/Typography"

const SomePage = () => {
  const session = useSession()
  console.log(session)

  return (
    <>
      <Head>
        <title>Some Route</title>
      </Head>
      <Container>
        <Heading>Hello, World!</Heading>
      </Container>
    </>
  )
}

export default SomePage
