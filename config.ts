type ConfigType = { [key: string]: string | boolean }

export const config: ConfigType = {
  BASE_URL: process.env.BASE_URL ?? "http://localhost:3000",
  COLLIBRA_BASE_URL: process.env.COLLIBRA_BASE_URL ?? "",
  INSIGHTS_CONNECTION_STRING: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING ?? "",

  /* Auth config */
  AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID ?? "",
  AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET ?? "",
  AUTH_TENANT_ID: process.env.AUTH_TENANT_ID ?? "",
  AUTH_SCOPE: process.env.AUTH_SCOPE ?? "",

  ACCESSIT_BASE_URL: "https://accessit.equinor.com",

  PREVENT_COLLIBRA_WORKFLOW: process.env.NEXT_PUBLIC_PREVENT_COLLIBRA_WORKFLOW === "true",
}
