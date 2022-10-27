export const config = Object.freeze({
  BASE_URL: process.env.BASE_URL ?? "http://localhost:3000",
  COLLIBRA_BASE_URL: process.env.NEXT_PUBLIC_COLLIBRA_BASE_URL ?? "",
  COLLIBRA_FIRST_TIME_VISITOR: process.env.NEXT_PUBLIC_COLLIBRA_FIRST_TIME_VISITOR ?? "",
  INSIGHTS_CONNECTION_STRING: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING ?? "",

  /* Auth config */
  AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID ?? "",
  AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET ?? "",
  AUTH_TENANT_ID: process.env.AUTH_TENANT_ID ?? "",
  AUTH_SCOPE: process.env.AUTH_SCOPE ?? "",

  ACCESSIT_BASE_URL: "https://accessit.equinor.com",

  PREVENT_COLLIBRA_WORKFLOW: process.env.NEXT_PUBLIC_PREVENT_COLLIBRA_WORKFLOW === "true",
})
