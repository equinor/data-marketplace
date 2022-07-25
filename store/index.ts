import { init, RematchDispatch, RematchRootState } from "@rematch/core"

import { RootModel } from "./RootModel"
import { checkoutModel } from "./checkout"

export const store = init({
  models: {
    checkout: checkoutModel,
  },
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
