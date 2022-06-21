import { NextApiHandler } from "next"

import { config } from "../../../../config"
import { HttpClient } from "../../../../lib/HttpClient"
import { HttpError } from "../../../../lib/HttpError"

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

        const usersRes = await Promise.all(usersWithRoles.map((user: any) => HttpClient.get<Collibra.User>(`${config.COLLIBRA_BASE_URL}/users/${user.id}`, {
          headers: { authorization: req.headers.authorization },
        })))

        const users = usersWithRoles.reduce((obj, user) => {
          const collibraUser = usersRes.find((r) => r.body?.id === user.id)?.body

          if (!collibraUser) return obj

          const transformedUser = {
            ...user,
            firstName: collibraUser.firstName,
            lastName: collibraUser.lastName,
            email: collibraUser.emailAddress,
          }

          if (user.role in obj) {
            return {
              ...obj,
              [user.role]: [
                ...obj[user.role],
                transformedUser,
              ],
            }
          }

          return {
            ...obj,
            [user.role]: [transformedUser],
          }
        }, {} as Record<string, any[]>)

        res.json(users)
      }
    } catch (error) {
      console.log("[AssetResponsibilitiesHandler]", error)
      const err = error as HttpError
      res.status(err.statusCode ?? 500).json(err.body)
    }
  }
}

export default AssetResponsibilitiesHandler
