import { NextApiHandler } from "next"

import mockAssets from "../../../__mock-data__/assets.json"

const SearchHandler: NextApiHandler = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).end()
  } else {
    const searchResults = mockAssets.filter((asset) => req.body.keywords
      .split(" ")
      .some((keyword: string) => asset.name.toLowerCase()
        .split(" ")
        .some((word) => word === keyword)))

    res.status(200).json({
      total: searchResults.length,
      results: searchResults.map((asset) => ({
        resource: {
          resourceType: asset.resourceType,
          id: asset.id,
          createdBy: asset.createdBy,
          createdOn: asset.createdOn,
          lastModifiedOn: asset.lastModifiedOn,
          name: asset.name,
          displayName: asset.displayName,
          type: asset.type,
          tags: [],
          status: asset.status,
        },
      })),
    })
  }
}

export default SearchHandler
