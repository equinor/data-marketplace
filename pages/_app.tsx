import { PublicClientApplication, LogLevel } from "@azure/msal-browser"
import { MsalProvider } from "@azure/msal-react"
import type { AppProps } from "next/app"
import { IntlProvider } from "react-intl"
import { Provider } from "react-redux"

import "../styles/globals.css"
import "../styles/banner.css"

import { Page } from "../components/Page"
import { config } from "../config"
import englishTexts from "../locales/english.json"
import { store } from "../store"

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: config.AUTH_CLIENT_ID,
    authority: config.AUTH_AUTHORITY,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
    secureCookies: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (
        level: LogLevel,
        message: string,
        containsPii: boolean,
      ): void => {
        if (containsPii) return

        switch (level) {
          case LogLevel.Error:
            console.error(message)
            break
          case LogLevel.Info:
            console.info(message)
            break
          case LogLevel.Verbose:
            console.debug(message)
            break
          case LogLevel.Warning:
            console.warn(message)
            break
          default:
            console.log(message)
            break
        }
      },
    },
  },
})

const App = ({ Component, pageProps }: AppProps) => (
  <MsalProvider instance={msalInstance}>
    <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
      <Provider store={store}>
        <Page>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </Page>
      </Provider>
    </IntlProvider>
  </MsalProvider>
)

export default App
