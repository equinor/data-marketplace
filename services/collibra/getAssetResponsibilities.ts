import { Responsibility } from "model/Responsibility"
import { ServiceRequester } from "services"

export const getAssetResponsibilities: ServiceRequester<Responsibility[]> = (client) => (
  async (id: string) => {
    const res = await client.get<Collibra.PagedResponsibilityResponse>("/responsibilities", {
      query: {
        resourceIds: [id],
      },
    })

    return res.body.results.map(Responsibility.fromCollibraResponsibility)
  }
)
