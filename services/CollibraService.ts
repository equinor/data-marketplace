import { config } from "config"
import { __HttpClient__ } from "lib/HttpClient"

export class CollibraService extends __HttpClient__ {
  constructor(token: string) {
    super({
      baseURL: config.COLLIBRA_BASE_URL,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
  }

  private async getAssetAttributes(
    id: string,
    ...attributes: string[]
  ): Promise<Collibra.Attribute[] | undefined> {
    const { body: pagedAttributeRes } = await this.get<Collibra.PagedAttributeResponse>("/attributes", {
      query: { assetId: id },
    })

    return pagedAttributeRes?.results.filter((attr) => (
      [...attributes].includes(attr.type.name!.toLowerCase())
    ))
  }

  async getAssetByID(id: string): Promise<DataMarketplace.Asset> {
    const res = await this.get<Collibra.Asset>(`/assets/${id}`)

    if (!res.body) {
      throw new Error()
    }

    return {
      id: res.body.id,
      name: res.body.name!,
      createdAt: Number.isNaN(new Date(res.body.createdOn).valueOf())
        ? null
        : new Date(res.body.createdOn),
      updatedAt: Number.isNaN(new Date(res.body.lastModifiedOn).valueOf())
        ? null
        : new Date(res.body.lastModifiedOn),
    }
  }
}
