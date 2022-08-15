import type { AppProps } from "next/app"
import Head from "next/head"
import { IntlProvider } from "react-intl"
import { Provider } from "react-redux"

import "../styles/globals.css"

import { Page } from "../components/Page"
import englishTexts from "../locales/english.json"
import { store } from "../store"

const App = ({ Component, pageProps }: AppProps) => (
  <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
    <Provider store={store}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Page>
    </Provider>
  </IntlProvider>
)

export default App
