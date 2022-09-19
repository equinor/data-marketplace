import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

import { config } from "config"
/* let history: History | null = null

if (typeof window !== "undefined") {
  history = window.history
} */

const reactPlugin = new ReactPlugin()
const appInsights = new ApplicationInsights({
  config: {
    connectionString: config.INSIGHTS_CONNECTION_STRING,
    extensions: [reactPlugin],
    /* extensionConfig: {
      [reactPlugin.identifier]: { history },
    }, */
    enableAutoRouteTracking: true,
  },
})

if (typeof window !== "undefined") {
  appInsights.loadAppInsights()
}

export { appInsights, reactPlugin }
