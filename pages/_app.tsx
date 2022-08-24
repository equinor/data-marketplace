import { SessionProvider } from "next-auth/react"
import type { AppProps } from "next/app"
import Head from "next/head"
import { IntlProvider } from "react-intl"
import { Provider } from "react-redux"

import "../styles/globals.css"

import { AuthContainer } from "../components/AuthContainer"
import englishTexts from "../locales/english.json"
import { store } from "../store"

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => (
  <SessionProvider session={session}>
    <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
      <Provider store={store}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <AuthContainer>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </AuthContainer>
      </Provider>
    </IntlProvider>
  </SessionProvider>
)

export default App
