import { NextApiHandler } from "next"

import { config } from "../../../../config"
import { HttpClient } from "../../../../lib/HttpClient"

const AssetResponsibilitiesHandler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).end()
  } else {
    try {
      const response = await HttpClient.get<Collibra.PagedResponsibilityResponse>(`${config.COLLIBRA_BASE_URL}/responsibilities`, {
        headers: { authorization: req.headers.authorization },
        query: { resourceIds: req.query.id },
      })

      if (!response.body) {
        res.status(500).end()
      } else {
        // filter out results that are not a "Role" and "User" type
        const usersWithRoles = response.body.results.filter((result: any) => (
          result.role.resourceType === "Role"
        && result.owner.resourceType === "User"
        )).map((responsibility: any) => ({
          role: responsibility.role.name.toUpperCase().replace(/\s/g, "_"),
          id: responsibility.owner.id,
        }))

        const usersRes = await Promise.all(usersWithRoles.map((user: any) => HttpClient.get(`${config.COLLIBRA_BASE_URL}/users/${user.id}`, {
          headers: { authorization: req.headers.authorization },
        })))

        const users = usersWithRoles.reduce((obj, user) => {
          const fullUser = usersRes.find((r) => r.body.id === user.id)?.body
          const u = {
            ...user,
            firstName: fullUser.firstName,
            lastName: fullUser.lastName,
            email: fullUser.emailAddress,
          }

          if (user.role in obj) {
            return {
              ...obj,
              [user.role]: [
                ...obj[user.role],
                u,
              ],
            }
          }

          return {
            ...obj,
            [user.role]: [u],
          }
        }, {} as Record<string, any[]>)

        res.json(users)
      }
    } catch (error) {
      console.log("[AssetResponsibilitiesHandler]", error)
      res.status((error as any).statusCode ?? 500).end()
    }
  }
}

export default AssetResponsibilitiesHandler
