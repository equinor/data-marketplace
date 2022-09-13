import xss from "xss"

import { config } from "config"
import { __HttpClient__ } from "lib/HttpClient"
import { Asset } from "model/Asset"
import { Responsibility } from "model/Responsibility"
import { User } from "model/User"

export class CollibraService extends __HttpClient__ {
  constructor(token: string) {
    super({
      baseURL: config.COLLIBRA_BASE_URL,
      headers: {
        authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    })
  }

  async getAssetAttributes(
    id: string,
    ...attributes: string[]
  ): Promise<Collibra.Attribute[]> {
    const { body: pagedAttributeRes } = await this.get<Collibra.PagedAttributeResponse>("/attributes", {
      query: { assetId: id },
    })

    return pagedAttributeRes.results.filter((attr) => (
      attributes.includes(attr.type.name!.toLowerCase())
    )).map((attr) => ({
      ...attr,
      value: xss(attr.value),
    }))
  }

  async getAsset(id: string): Promise<Asset> {
    const res = await this.get<Collibra.Asset>(`/assets/${id}`)

    return Asset.fromCollibraAsset(res.body)
  }

  async getAssetWithAttributes(id: string): Promise<Asset> {
    const asset = await this.getAsset(id)
    const attributeNames = ["description", "timeliness"]
    const attributes = await this.getAssetAttributes(id, ...attributeNames)

    asset.description = attributes
      .find((attr) => attr.type.name!.toLowerCase() === "description")?.value ?? null
    asset.updateFrequency = attributes
      .find((attr) => attr.type.name!.toLowerCase() === "timeliness")?.value ?? null

    return asset
  }

  async getUser(id: string): Promise<User> {
    const res = await this.get<Collibra.User>(`${config.COLLIBRA_BASE_URL}/users/${id}`)
    return User.fromCollibraUser(res.body)
  }

  async getAssetResponsibilities(id: string): Promise<Responsibility[]> {
    const res = await this.get<Collibra.PagedResponsibilityResponse>(`${config.COLLIBRA_BASE_URL}/responsibilities`, {
      query: {
        resourceIds: [id],
      },
    })

    return res.body.results.map(Responsibility.fromCollibraResponsibility)
  }
}
