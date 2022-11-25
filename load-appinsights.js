const appInsights = require("applicationinsights")
require("dotenv").config()

console.log(process.env)

appInsights
  .setup(
    "InstrumentationKey=e4d53b02-e08f-45e0-8632-7a066b44bc4f;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/"
  )
  .setAutoCollectConsole(true, true)
  .setAutoCollectDependencies(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectHeartbeat(true)
  .setAutoCollectPerformance(true, true)
  .setAutoCollectRequests(true)
  .setAutoDependencyCorrelation(true)
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
  .setSendLiveMetrics(true)
  .setUseDiskRetryCaching(true)
appInsights.defaultClient.setAutoPopulateAzureProperties(true)
appInsights.start()
