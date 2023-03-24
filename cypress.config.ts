import { defineConfig } from "cypress"

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    experimentalModifyObstructiveThirdPartyCode: true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
