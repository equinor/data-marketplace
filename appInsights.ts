import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

const env = process.env.NODE_ENV

const getConnectionString = (hostname: string) => {
  const testConnectionString =
    "InstrumentationKey=3a749405-8c63-4e7a-99c7-a7e66f47fa2f;IngestionEndpoint=https://northeurope-0.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/"
  const prodConnectionString =
    "InstrumentationKey=7eea9263-fb34-4006-9954-dc4568c322ac;IngestionEndpoint=https://northeurope-3.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/InstrumentationKey=e9198130-5b49-4cdc-9d93-0ddd24022bc3;IngestionEndpoint=https://northeurope-0.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/"
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
      connectionString: getConnectionString(window.location.hostname),
      extensions: [reactPlugin],
      enableAutoRouteTracking: true,
    },
  })

  appInsights.loadAppInsights()
}

export { appInsights, reactPlugin }
