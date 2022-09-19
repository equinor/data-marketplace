import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, FunctionComponent, ReactNode } from "react"
import { useIntl } from "react-intl"
import styled from "styled-components"

import { Footer } from "../Footer"
import { NavBar } from "../NavBar"

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  &:has(.background-highlight:last-child) {
    background-color: var(--highlight-colour);
  } 
`

type Props = {
  children: ReactNode
  pageViewName: string
  documentTitle?: string
};

export const Page: FunctionComponent<Props> = ({ documentTitle, pageViewName, children }) => {
  const intl = useIntl()
  const router = useRouter()
  const appInsights = useAppInsightsContext()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      console.log("logging route change", url)
      appInsights.trackPageView({ name: pageViewName, uri: url })
    }

    router.events.on("routeChangeStart", handleRouteChange)

    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
    }
  }, [router.events, appInsights, pageViewName])
  return (
    <PageWrapper>
      <Head>
        <title>
          {documentTitle || intl.formatMessage({ id: "common.documentTitle" })}
        </title>
      </Head>
      <NavBar />

      {children}
      <Footer />
    </PageWrapper>
  )
}
