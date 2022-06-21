import { PublicClientApplication, LogLevel } from "@azure/msal-browser"
import { MsalProvider } from "@azure/msal-react"
import type { AppProps } from "next/app"
import { IntlProvider } from "react-intl"

import "focus-visible"
import "../styles/globals.css"

import { Page } from "../components/Page"
import { config } from "../config"
import english from "../locales/en.json"

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
    <IntlProvider locale="en" messages={english}>
      <Page>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Page>
    </IntlProvider>
  </MsalProvider>
)

export default App
