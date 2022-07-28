import { createModel } from "@rematch/core"

import type { RootModel } from "./RootModel"

type CheckoutState = {
  cart: string[],
  step: number
  data: Record<string, any>
}

export const checkoutModel = createModel<RootModel>()({
  name: "checkout",
  state: {
    cart: [],
    step: 0,
    data: {},
  } as CheckoutState,
  reducers: {
    setStep: (state, step: number) => ({
      ...state,
      step,
    }),
    addToCart: (state, assetId: string) => ({
      ...state,
      cart: [...(new Set([...state.cart, assetId]))],
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
