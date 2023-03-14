import { notFound } from "next/navigation"

import { HelloWorld } from "./helloworld"

async function getPosts() {
  const posts = [
    {
      name: "hello",
    },
    {
      name: "world",
    },
  ]
  return posts
}

export default async function Page() {
  const USE_APP_FOLDER = process.env.USE_APP_FOLDER === "true"
  if (!USE_APP_FOLDER) {
    notFound()
  }

  // Fetch data directly in a Server Component
  const recentPosts = await getPosts()
  // Forward fetched data to your Client Component
  return <HelloWorld recentPosts={recentPosts} />
}
