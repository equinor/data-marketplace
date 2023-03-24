/* describe("Azure Active Directory Authentication", () => {
  beforeEach(() => {
    // log into Azure Active Directory through our sample SPA using our custom command
    cy.loginToAAD(Cypress.env("aad_username"), Cypress.env("aad_password"))
    cy.visit("http://localhost:3000")
  })

  it("verifies the user logged in has the correct name", () => {
    cy.get("#table-body-div td:contains('name') + td").should("contain", `${Cypress.env("aad_name")}`)
  })

  it("verifies the user logged in has the correct preferred name", () => {
    cy.get("#table-body-div td:contains('preferred_username') + td").should("contain", `${Cypress.env("aad_username")}`)
  })
})
 */

describe("Should be able to login using a mock setup", () => {
  // eslint-disable-next-line func-names, prefer-arrow-callback
  beforeEach(function () {
    // Call your custom cypress command
    // @ts-ignore
    cy.mockLogin()
    // Visit a route in order to allow cypress to actually set the cookie
    cy.visit("/")
    // Wait until the intercepted request is ready
    // Denne feiler litt random, skjønner ikke helt denne og om vi trenger den eller ei
    // cy.wait("@session")
  })
  it("should provide a valid session", () => {
    // This is where you can now add assertions
    // Example: provide a data-test-id on an element.
    // This can be any selector that "always and only" exists when the user is logged in
    cy.get("#searchButton")
      .should("exist")
      .then(() => {
        cy.log("Cypress login successful")
      })
  })
})

export {}
