import { ERR_CODES, ExternalError } from "lib/errors"
import { Domain } from "model/Domain"
import { ServiceRequester } from "services"

export const getDomainByName: ServiceRequester<Domain> = (client) => async (name: string) => {
  const res = await client.get<Collibra.PagedDomainResponse>("/domains", {
    query: {
      name,
      nameMatchMode: "ANYWHERE",
    },
  })

  if (res.body.total === 0) {
    throw new ExternalError(`No domains found with name "${name}"`, ERR_CODES.MISSING_DATA)
  }

  return Domain.fromCollibraDomain(res.body.results[0])
}
