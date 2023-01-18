import algoliasearch from "algoliasearch/lite"

type ConfigType = Record<string, string | number | boolean>

export const config: ConfigType = {
  BASE_URL: process.env.BASE_URL ?? "http://localhost:3000",
  COLLIBRA_BASE_URL: process.env.COLLIBRA_BASE_URL ?? "",
  COLLIBRA_API_URL: process.env.COLLIBRA_BASE_URL ? `${process.env.COLLIBRA_BASE_URL}/rest/2.0` : "",
  ADAPTER_SERVICE_BASE_URL: process.env.ADAPTER_SERVICE_BASE_URL ?? "",
  ADAPTER_SERVICE_API_URL: process.env.ADAPTER_SERVICE_BASE_URL ? `${process.env.ADAPTER_SERVICE_BASE_URL}/api` : "",
  ADAPTER_SERVICE_APP_KEY: process.env.ADAPTER_SERVICE_APP_KEY ?? "",

  /* Auth config */
  AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID ?? "",
  AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET ?? "",
  AUTH_TENANT_ID: process.env.AUTH_TENANT_ID ?? "",
  AUTH_SCOPE: process.env.AUTH_SCOPE ?? "",

  ACCESSIT_BASE_URL: "https://accessit.equinor.com",

  PREVENT_COLLIBRA_WORKFLOW: process.env.NEXT_PUBLIC_PREVENT_COLLIBRA_WORKFLOW === "true",
}

const algolia = {
  applicationId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  searchApiKey: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "",
  searchApiServerKey: process.env.ALGOLIA_SEARCH_API_SERVER_KEY || "",
}

console.log("Algolia config", algolia.applicationId, algolia.searchApiKey)

export const searchClient = algoliasearch(algolia.applicationId, algolia.searchApiKey)
export const searchClientServer = algoliasearch(algolia.applicationId, algolia.searchApiServerKey)
