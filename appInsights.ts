import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

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

const getConnectionString = (hostname: string) => {
  if (hostname.includes("datamarketplace.equinor.com")) {
    return "InstrumentationKey=e4d53b02-e08f-45e0-8632-7a066b44bc4f;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/"
  }
  return "InstrumentationKey=a8e5931e-ee21-4caf-accc-e1a49ed1a166;IngestionEndpoint=https://northeurope-0.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/"
}

const reactPlugin = new ReactPlugin()
// eslint-disable-next-line import/no-mutable-exports
let appInsights: ApplicationInsights
if (typeof window !== "undefined" && env === "production") {
  appInsights = new ApplicationInsights({
    config: {
      connectionString: getConnectionString(window.location.hostname), // getConnectionString()
      extensions: [reactPlugin],
      enableAutoRouteTracking: true,
    },
  })

  appInsights.loadAppInsights()
}

export { appInsights, reactPlugin }
