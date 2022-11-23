import { NextApiHandler } from "next"

import { config } from "config"

type EnvironmentVariablesType = { [key: string]: string }
const ENVIRONMENT_VARIABLES: EnvironmentVariablesType = {
  INSIGHTS_CONNECTION_STRING: "INSIGHTS_CONNECTION_STRING",
}

const possiblyGetConfigVariable =
  (environmentVariables: EnvironmentVariablesType) => (configSetting: string | string[] | undefined) =>
    typeof configSetting === "string" && configSetting.toUpperCase() in ENVIRONMENT_VARIABLES
      ? config[environmentVariables[configSetting.toUpperCase()]]
      : null

const ConfigSetting: NextApiHandler = (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const { configSetting } = req.query

  const possibleSetting = possiblyGetConfigVariable(ENVIRONMENT_VARIABLES)

  const value = possibleSetting(configSetting)

  return value ? res.status(200).json(value) : res.status(404)
}

export default ConfigSetting
