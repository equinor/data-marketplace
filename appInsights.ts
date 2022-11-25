import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"
import getConfig from "next/config"

/* import { config } from "config" */

// import { HttpClient } from "lib/HttpClient"

const env = process.env.NODE_ENV
/* let history: History | null = null

if (typeof window !== "undefined") {
  history = window.history
} */

/* const getConnectionString = () => {
  const connectionString = fetch("/api/configsettings/insights_connection_string")
  console.log("The string", connectionString)
  return connectionString
} */

const { publicRuntimeConfig } = getConfig()
console.log("The environtment var", publicRuntimeConfig.MY_VAR)

const reactPlugin = new ReactPlugin()

const appInsights = new ApplicationInsights({
  config: {
    connectionString: publicRuntimeConfig.MY_VAR as string, // getConnectionString()
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
})

if (typeof window !== "undefined" && env === "production") {
  appInsights.loadAppInsights()
}

export { appInsights, reactPlugin }
