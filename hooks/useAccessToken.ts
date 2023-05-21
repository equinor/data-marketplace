import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

import type { Session } from "lib/getSession"

export const useAccessToken = () => {
  const [token, setToken] = useState<string>("")
  const { data, status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      setToken((data as Session).token as string)
    }
  }, [status, data])

  return token
}
