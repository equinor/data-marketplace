describe("Can browse Marketing & Supply business area data products", () => {
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
  it("should have a shortcut on the frontpage", () => {
    // This is where you can now add assertions
    // Example: provide a data-test-id on an element.
    // This can be any selector that "always and only" exists when the user is logged in
    cy.get("#marketingAndSupply")
      .should("exist")
      .click()
      .then(() => {
        cy.log("Clicked the Marketing & Supply browse link")
      })
  })

  it("should have the M&S filter preselected", () => {
    cy.get("#marketingAndSupply")
      .click()
      .get("#communityFilter:has(label:contains('Marketing and Supply'))")
      .find("[type='checkbox']")
      .should("be.checked")
  })
})

export {}
