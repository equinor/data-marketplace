import { User } from "model/User"
import { ServiceRequester } from "services"

export const getUser: ServiceRequester<User> = (client) => async (id: string) => {
  const { body: user } = await client.get<Collibra.User>(`/users/${id}`)
  return User.fromCollibraUser(user)
}
