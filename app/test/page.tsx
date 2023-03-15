import { notFound } from "next/navigation"

import { FrontPage } from "./FrontPage"

export default async function Page() {
  const USE_APP_FOLDER = process.env.USE_APP_FOLDER === "true"
  const indexName = process.env.ALGOLIA_SEARCH_INDEX ?? ""

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
