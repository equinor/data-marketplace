import xss from "xss"

import { __HttpClient__ } from "lib/HttpClient"
import { ServiceRequester } from "services"

export const getAssetAttributes: ServiceRequester<
Collibra.Attribute[]
> = (client: __HttpClient__) => (
  async (id: string, ...attributes: string[]): Promise<Collibra.Attribute[]> => {
    let { body: { results: attrs } } = await client.get<Collibra.PagedAttributeResponse>("/attributes", {
      query: { assetId: id },
    })

    attrs = attrs.map((attr) => ({
      ...attr,
      value: xss(attr.value),
    }))

    if (attributes.length > 0) {
      return attrs.filter((attr) => (
        attributes.includes(attr.type.name!.toLowerCase())
      ))
    }

    return attrs
  }
)
