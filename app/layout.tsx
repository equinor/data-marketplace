import localFont from "next/font/local"
import { headers } from "next/headers"
import { Session } from "next-auth"

import { AppInsightsContext } from "./AppInsightsContext"
import { AuthContext } from "./AuthContext"
import { IntlContext } from "./IntlContext"

import StyledComponentsRegistry from "lib/registry"
import englishTexts from "locales/english.json"
import { GlobalStyle } from "styles/globals"

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookie,
    },
  })

  const session = await response.json()

  return Object.keys(session).length > 0 ? session : null
}

const equinorFont = localFont({
  src: "./static/EquinorVariable.woff2",
  display: "swap",
})

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession(headers().get("cookie") ?? "")
  return (
    <html lang="en" className={equinorFont.className}>
      <head>
        {/*    <link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-font.css" /> */}
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthContext session={session}>
          <IntlContext locale="en" defaultLocale="en" messages={englishTexts}>
            <AppInsightsContext>
              <StyledComponentsRegistry>
                <GlobalStyle />
                {children}
              </StyledComponentsRegistry>
            </AppInsightsContext>
          </IntlContext>
        </AuthContext>
      </body>
    </html>
  )
}

//         <link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-uprights-vf.css" />
// eslint-disable-next-line import/no-default-export
export default RootLayout
