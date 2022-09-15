type AssetInit = {
  id: string
  name: string
  description?: string
  domain?: string
  updateFrequency?: string
  tags?: DataMarketplace.Tag[]
  createdAt?: Date | number | string
  updatedAt?: Date | number | string
}

export class Asset implements DataMarketplace.Asset {
  id: string
  name: string
  description: Optional<string>
  domain: Optional<string>
  updateFrequency: Optional<string>
  tags: Optional<DataMarketplace.Tag[]>
  createdAt: Optional<Date>
  updatedAt: Optional<Date>

  constructor(init: AssetInit) {
    this.id = init.id
    this.name = init.name
    this.description = init.description || null
    this.domain = init.domain || null
    this.updateFrequency = init.updateFrequency || null
    this.tags = init.tags || null
    this.createdAt = Number.isNaN(new Date(init.createdAt!).valueOf())
      ? null : new Date(init.createdAt!)
    this.updatedAt = Number.isNaN(new Date(init.updatedAt!).valueOf())
      ? null : new Date(init.updatedAt!)
  }

  static fromCollibraAsset(asset: Collibra.Asset) {
    return new Asset({
      id: asset.id,
      name: asset.name!,
      domain: asset.domain.name!,
      createdAt: asset.createdOn,
      updatedAt: asset.lastModifiedOn,
    })
  }
}
