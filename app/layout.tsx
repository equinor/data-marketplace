import { headers } from "next/headers"
import { Session } from "next-auth"

import { AppInsightsContext } from "./AppInsightsContext"
import { AuthContext } from "./AuthContext"
import { IntlContext } from "./IntlContext"

import { Footer } from "components/Footer"
import { LayoutWrapper } from "components/Layout"
import { NavBar } from "components/NavBar"
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

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession(headers().get("cookie") ?? "")
  return (
    <html lang="en">
      <head>
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
                <LayoutWrapper>
                  <NavBar />
                  {children}
                  <Footer />
                </LayoutWrapper>
              </StyledComponentsRegistry>
            </AppInsightsContext>
          </IntlContext>
        </AuthContext>
      </body>
    </html>
  )
}

// eslint-disable-next-line import/no-default-export
export default RootLayout
