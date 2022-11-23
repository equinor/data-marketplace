import { NextApiHandler } from "next"

type EnvironmentVariablesType = { [key: string]: string }
const ENVIRONMENT_VARIABLES: EnvironmentVariablesType = {
  INSIGHTS_CONNECTION_STRING: "INSIGHTS_CONNECTION_STRING",
}

const possiblyGetConfigVariable =
  (environmentVariables: EnvironmentVariablesType) => (configSetting: string | string[] | undefined) =>
    typeof configSetting === "string" && configSetting in ENVIRONMENT_VARIABLES
      ? environmentVariables[configSetting]
      : null

const ConfigSetting: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const { configSetting } = req.query
  const possibleSetting = possiblyGetConfigVariable(ENVIRONMENT_VARIABLES)
  const value = possibleSetting(configSetting)

  return value ? res.status(200).json(value) : res.status(404)
}

export default ConfigSetting
