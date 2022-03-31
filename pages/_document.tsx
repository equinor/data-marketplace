import {
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document"
import type { VoidFunctionComponent } from "react"

const Document: VoidFunctionComponent<DocumentProps> = () => (
  <Html>
    <Head>
      <link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-font.css" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
