// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands"

// Alternatively you can use CommonJS syntax:
// require('./commands')
// cypress/support/e2e.ts

function loginViaAAD(username: string, password: string) {
  cy.visit("http://localhost:3000/")
  cy.get("button#signIn").click()

  // Login to your AAD tenant.
  cy.origin(
    "login.microsoftonline.com",
    {
      args: {
        username,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ username }) => {
      cy.get("input[type='email']").type(username, {
        log: false,
      })
      cy.get("input[type='submit']").click()
    }
  )

  // depending on the user and how they are registered with Microsoft, the origin may go to live.com
  cy.origin(
    "https://login.microsoftonline.com",
    {
      args: {
        password,
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ password }) => {
      cy.get("input[type='password']").type(password, {
        log: false,
      })
      cy.get("input[type='submit']").click()
      cy.get("#idBtn_Back").click()
    }
  )

  // Ensure Microsoft has redirected us back to the sample app with our logged in user.
  cy.url().should("equal", "http://localhost:3000/")
  cy.get("#welcome-div").should("contain", `Welcome ${Cypress.env("aad_username")}!`)
}

/* @ts-ignore */
Cypress.Commands.add("loginToAAD", (username: string, password: string) => {
  const log = Cypress.log({
    displayName: "Azure Active Directory Login",
    message: [`🔐 Authenticating | ${username}`],
    autoEnd: false,
  })
  log.snapshot("before")

  loginViaAAD(username, password)

  log.snapshot("after")
  log.end()
})

/* @ts-ignore */
Cypress.Commands.add("mockLogin", () => {
  cy.session("next-auth.session-token", () => {
    cy.intercept("/api/auth/session", { fixture: "session.json" }).as("session")

    // Set the cookie for cypress.
    // It has to be a valid cookie so next-auth can decrypt it and confirm its validity.
    // This step can probably/hopefully be improved.
    // We are currently unsure about this part.
    // We need to refresh this cookie once in a while.
    // We are unsure if this is true and if true, when it needs to be refreshed.
    cy.setCookie("next-auth.session-token", Cypress.env("NEXT_AUTH_SESSION_TOKEN"))
  })
  // Cypress.Cookies.preserveOnce("next-auth.session-token")
})
