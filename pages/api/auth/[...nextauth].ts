import NextAuth from "next-auth"
import ADProvider from "next-auth/providers/azure-ad"

import { config } from "../../../config"

export default NextAuth({
  providers: [
    ADProvider({
      clientId: config.AUTH_CLIENT_ID,
      clientSecret: config.AUTH_CLIENT_SECRET,
      tenantId: config.AUTH_TENANT_ID,
    }),
  ],
})
