import {
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document"
import { FunctionComponent } from "react"

const Document: FunctionComponent<DocumentProps> = () => (
  <Html lang="en">
    <Head>
      <link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-font.css" />
      <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />
      <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
