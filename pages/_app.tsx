import { AppInsightsContext } from "@microsoft/applicationinsights-react-js"
import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { IntlProvider } from "react-intl"

import { reactPlugin } from "appInsights"
import { AuthContainer } from "components/AuthContainer"
import englishTexts from "locales/english.json"
import { GlobalStyle } from "styles/globals"

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SessionProvider session={session}>
    <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
      <AppInsightsContext.Provider value={reactPlugin}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <GlobalStyle />
        <AuthContainer>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </AuthContainer>
      </AppInsightsContext.Provider>
    </IntlProvider>
  </SessionProvider>
)

export default App
