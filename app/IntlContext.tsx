"use client"

import { IntlProvider, IntlConfig } from "react-intl"

type IntlContextProps = {
  children: React.ReactNode
} & IntlConfig

export const IntlContext = ({ locale, defaultLocale, messages, children }: IntlContextProps) => (
  <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
    {children}
  </IntlProvider>
)
