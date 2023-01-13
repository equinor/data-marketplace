import { NextApiHandler } from "next"

import { config } from "config"

type EnvironmentVariablesType = { [key: string]: string }
const ENVIRONMENT_VARIABLES: EnvironmentVariablesType = {
  ADAPTER_SERVICE_APP_KEY: "ADAPTER_SERVICE_APP_KEY",
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

  const { configsetting } = req.query
  const possibleSetting = possiblyGetConfigVariable(ENVIRONMENT_VARIABLES)
  const value = possibleSetting(configsetting)

  return value ? res.status(200).json(value) : res.status(404).end()
}

export default ConfigSetting
