import { ReactPlugin } from "@microsoft/applicationinsights-react-js"
import { ApplicationInsights } from "@microsoft/applicationinsights-web"

let history: History | null = null

if (typeof window !== "undefined") {
  history = window.history
}

const reactPlugin = new ReactPlugin()
const appInsights = new ApplicationInsights({
  config: {
    instrumentationKey: "keyboardcat",
    extensions: [reactPlugin],
    extensionConfig: {
      [reactPlugin.identifier]: { history },
    },
  },
})

if (typeof window !== "undefined") {
  appInsights.loadAppInsights()
}

export { appInsights, reactPlugin }
