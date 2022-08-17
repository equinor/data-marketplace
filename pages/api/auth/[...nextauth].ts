import NextAuth from "next-auth"
import ADProvider from "next-auth/providers/azure-ad"

import { config } from "../../../config"

export default NextAuth({
  providers: [
    ADProvider({
      clientId: config.AUTH_CLIENT_ID,
      clientSecret: config.AUTH_CLIENT_SECRET,
      tenantId: config.AUTH_TENANT_ID,
      authorization: {
        params: { scope: "openid https://equinor-dev.collibra.com/user_impersonation" },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log(token, user)
      return token
    },
  },
})
