import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

import { config } from "config"
// import { HttpClient } from "lib/HttpClient"

const env = process.env.NODE_ENV
/* let history: History | null = null

if (typeof window !== "undefined") {
  history = window.history
} */

/* const getConnectionString = async () => {
  const connectionString = await HttpClient.get("/api/configsettings/insights_connection_string")
  return connectionString
} */

const reactPlugin = new ReactPlugin()

const appInsights = new ApplicationInsights({
  config: {
    connectionString: config.INSIGHTS_CONNECTION_STRING as string, // getConnectionString()
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
  },
})

if (typeof window !== "undefined" && env === "production") {
  appInsights.loadAppInsights()
}

export { appInsights, reactPlugin }
