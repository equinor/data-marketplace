import jwt, { JwtPayload } from "jsonwebtoken"

export const getTokenExpirationTime = (token: string) => {
  const { exp } = jwt.decode(token) as JwtPayload
  return new Date((exp as number) * 1000).valueOf() - 6000 * 5
}
