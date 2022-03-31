import type { NextApiHandler } from "next"

import assets from "../../../../__mock-data__/assets.json"
import mostViewedAssets from "../../../../__mock-data__/most_viewed.json"

const MostViewedHandler: NextApiHandler = (req, res) => {
  if (req.method !== "GET") {
    res.status(405).end()
    return
  }

  const limit = Number.isNaN(Number(req.query.limit)) ? undefined : Number(req.query.limit)

  const results = mostViewedAssets
    .slice(0, limit)
    .map((popularAsset) => ({
      ...assets.find((asset) => asset.id === popularAsset.assetId),
      numberOfViews: popularAsset.numberOfViews,
    }))
    .sort((a, b) => b.numberOfViews - a.numberOfViews)

  res.json({ results })
}

export default MostViewedHandler
