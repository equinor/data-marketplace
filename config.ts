export const config = Object.freeze({
  BASE_URL: process.env.BASE_URL ?? "http://localhost:3000",
  COLLIBRA_BASE_URL: process.env.NEXT_PUBLIC_COLLIBRA_BASE_URL ?? "",

  /* Auth config */
  AUTH_AUTHORITY: process.env.NEXT_PUBLIC_AUTH_AUTHORITY ?? "",
  AUTH_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID ?? "",
})
