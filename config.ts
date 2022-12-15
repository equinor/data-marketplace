type ConfigType = { [key: string]: string | boolean }

export const config: ConfigType = {
  BASE_URL: process.env.BASE_URL ?? "http://localhost:3000",
  COLLIBRA_BASE_URL: process.env.COLLIBRA_BASE_URL ?? "",
  COLLIBRA_API_URL: `${process.env.COLLIBRA_BASE_URL}/rest/2.0` || "",
  INSIGHTS_CONNECTION_STRING:
    "InstrumentationKey=e4d53b02-e08f-45e0-8632-7a066b44bc4f;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/" ??
    "",

  /* Auth config */
  AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID ?? "",
  AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET ?? "",
  AUTH_TENANT_ID: process.env.AUTH_TENANT_ID ?? "",
  AUTH_SCOPE: process.env.AUTH_SCOPE ?? "",

  ACCESSIT_BASE_URL: "https://accessit.equinor.com",

  PREVENT_COLLIBRA_WORKFLOW: process.env.NEXT_PUBLIC_PREVENT_COLLIBRA_WORKFLOW === "true",
}
