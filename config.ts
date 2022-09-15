export const config = Object.freeze({
  BASE_URL: process.env.BASE_URL ?? "http://localhost:3000",
  COLLIBRA_BASE_URL: process.env.NEXT_PUBLIC_COLLIBRA_BASE_URL ?? "",

  /* Auth config */
  AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID ?? "",
  AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET ?? "",
  AUTH_TENANT_ID: process.env.AUTH_TENANT_ID ?? "",

  ACCESSIT_BASE_URL: "https://accessit.equinor.com",
})
