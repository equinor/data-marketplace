import { Status } from "model/Status"
import { ServiceRequester } from "services"

export const getStatusByName: ServiceRequester<Status> = (client) => async (name: string) => {
  const res = await client.get<Collibra.Status>(`/statuses/name/${name}`)
  return Status.fromCollibraStatus(res.body)
}
