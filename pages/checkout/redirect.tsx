import { Progress, Typography } from "@equinor/eds-core-react"
import type { NextPage } from "next/types"
import { useEffect, useState } from "react"

import { CheckoutWizard } from "../../components/CheckoutWizard/CheckoutWizard"
import { Container } from "../../components/Container"
import { Link } from "../../components/Link"

const CheckoutRedirectView: NextPage = () => {
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (Math.round(oldProgress) >= 100) return 100
        return oldProgress + 0.1
      })
    }, 1)

    return () => clearInterval(interval)
  }, [progress, setProgress])

  if (progress === 100) {
    window.open("https://accessit.equinor.com", "_blank")
  }

  return (
    <Container>
      <CheckoutWizard>
        <Typography variant="h4" as="h1">
          Redirecting to AccessIT
        </Typography>

        <Typography variant="ingress">
          You&apos;ll now get redirected to AccessIT to complete the request process.
        </Typography>

        <Typography>
          If you don&apos;t get redirected within 15 seconds, please click this this link:
          {" "}
          <Link href="https://accessit.equinor.com">
            https://accessit.equinor.com
          </Link>
        </Typography>

        <Progress.Linear
          variant="determinate"
          value={progress}
        />
      </CheckoutWizard>
    </Container>
  )
}

export default CheckoutRedirectView
