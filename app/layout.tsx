/* import StyledComponentsRegistry from "lib/registry"
import { AppInsightsContext, AppInsightsErrorBoundary } from "@microsoft/applicationinsights-react-js"
import type { AppProps } from "next/app" */
/* import Head from "next/head"
import { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"
import { IntlProvider } from "react-intl"
import { reactPlugin } from "appInsights"
import { ErrorBoundary } from "components/ErrorBoundary"
import englishTexts from "locales/english.json"
import { GlobalStyle } from "styles/globals" */

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  console.log("The layout")
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-font.css" />
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
      </head>
      <body>
        {/*     <SessionProvider session={pageProps.session}>
          <IntlProvider locale="en" defaultLocale="en" messages={englishTexts}>
            <AppInsightsErrorBoundary onError={ErrorBoundary} appInsights={reactPlugin}>
              <AppInsightsContext.Provider value={reactPlugin}>
                <Head>
                  <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>

                <StyledComponentsRegistry>
                  <GlobalStyle />
                  {children}
                </StyledComponentsRegistry>
              </AppInsightsContext.Provider>
            </AppInsightsErrorBoundary>
          </IntlProvider>
        </SessionProvider> */}
        {children}
      </body>
    </html>
  )
}

// eslint-disable-next-line import/no-default-export
export default RootLayout
