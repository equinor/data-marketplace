import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { FrontPage } from "./FrontPage"

import englishTexts from "locales/english.json"

export async function generateMetadata(): Promise<Metadata> {
  const title: string = englishTexts["common.documentTitle"]
  return { title }
}

// eslint-disable-next-line import/no-default-export
export default async function Page() {
  const USE_APP_FOLDER = process.env.USE_APP_FOLDER === "true"
  const indexName = process.env.ALGOLIA_SEARCH_INDEX ?? ""

  console.log("USE_APP_FOLDER: ", USE_APP_FOLDER)

  if (!USE_APP_FOLDER) {
    notFound()
  }

  if (indexName === "") {
    console.log("Missing the Algolia search index name")
  }

  return (
    <main>
      <FrontPage indexName={indexName} />
    </main>
  )
}
