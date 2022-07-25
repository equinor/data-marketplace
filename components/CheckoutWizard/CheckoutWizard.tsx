import { FunctionComponent } from "react"

import { CheckoutNav } from "./Nav"

export const CheckoutWizard: FunctionComponent = ({ children }) => (
  <div>
    <CheckoutNav />
    {children}
  </div>
)
