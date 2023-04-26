import type { Metadata } from "next"

import { FrontPage } from "./FrontPage"

import englishTexts from "locales/english.json"

export async function generateMetadata(): Promise<Metadata> {
  const title: string = englishTexts["common.documentTitle"]
  return { title }
}

// eslint-disable-next-line import/no-default-export
export default async function Page() {
  const indexName = process.env.ALGOLIA_SEARCH_INDEX ?? ""

  return (
    <main>
      <FrontPage indexName={indexName} />
    </main>
  )
}
