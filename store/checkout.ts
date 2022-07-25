import { createModel } from "@rematch/core"

import type { RootModel } from "./RootModel"

type CheckoutState = {
  step: number
  data: Record<string, any>
}

export const checkoutModel = createModel<RootModel>()({
  name: "checkout",
  state: {
    step: 0,
    data: {},
  } as CheckoutState,
  reducers: {
    setStep: (state, step: number) => ({
      ...state,
      step,
    }),
    setData: (state, payload: Record<string, any>) => ({
      ...state,
      data: {
        ...state.data,
        ...payload,
      },
    }),
  },
})
