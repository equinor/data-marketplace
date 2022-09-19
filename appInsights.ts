import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

/* let history: History | null = null

if (typeof window !== "undefined") {
  history = window.history
} */

const reactPlugin = new ReactPlugin()
const appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION_STRING || "",
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
