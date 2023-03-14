"use client"

import {
  AppInsightsContext as MsAppInsightsContext,
  AppInsightsErrorBoundary,
} from "@microsoft/applicationinsights-react-js"

import { reactPlugin } from "appInsights"
import { ErrorBoundary } from "components/ErrorBoundary"

type IntlContextProps = {
  children: React.ReactNode
}

export const AppInsightsContext = ({ children }: IntlContextProps) => (
  <AppInsightsErrorBoundary onError={ErrorBoundary} appInsights={reactPlugin}>
    <MsAppInsightsContext.Provider value={reactPlugin}>{children}</MsAppInsightsContext.Provider>
  </AppInsightsErrorBoundary>
)
