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
  const testConnectionString =
    "InstrumentationKey=dfd96105-2c77-4afb-af8d-f7dca537a938;IngestionEndpoint=https://northeurope-3.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/"
  const prodConnectionString =
    "InstrumentationKey=e9198130-5b49-4cdc-9d93-0ddd24022bc3;IngestionEndpoint=https://northeurope-0.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/"
  if (hostname.includes("datamarketplace.equinor.com")) {
    return prodConnectionString
  }
  return testConnectionString
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
