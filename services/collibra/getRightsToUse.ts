import { Attribute } from "model/Attribute"
import { ServiceRequester } from "services"

export const getRightsToUse: ServiceRequester<Attribute[]> = (client) => async (id: string) => {
  const relationTypeRes = await client.get<Collibra.PagedRelationTypeResponse>("/relationTypes", {
    query: {
      sourceTypeName: "data product",
      targetTypeName: "rights-to-use",
    },
  })

  const relationsRes = await client.get<Collibra.PagedRelationResponse>("/relations", {
    query: {
      relationTypeId: relationTypeRes.body.results[0].id,
      sourceId: id,
    },
  })

  const rightsToUseAttrsRes = await client.get<Collibra.PagedAttributeResponse>("/attributes", {
    query: {
      assetId: relationsRes.body.results[0]?.target.id,
    },
  })

  return rightsToUseAttrsRes.body.results.map(Attribute.fromCollibraAttribute)
}
