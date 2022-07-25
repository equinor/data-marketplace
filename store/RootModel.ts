import type { Models } from "@rematch/core"

import { checkoutModel } from "./checkout"

export type RootModel = Models<RootModel> & {
  checkout: typeof checkoutModel
}
