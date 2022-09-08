import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { IntlProvider } from "react-intl"

import { AuthContainer } from "components/AuthContainer"
import englishTexts from "locales/english.json"
import { GlobalStyle } from "styles/globals"

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SessionProvider session={session}>
    <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GlobalStyle />
      <AuthContainer>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </AuthContainer>
    </IntlProvider>
  </SessionProvider>
)

export default App
