import useLocalStorageState from "use-local-storage-state"

type CheckoutData = {
  terms?: {
    termsAccepted: boolean
  }
}

export const useCheckoutData = () => {
  const [checkoutData, setCheckoutData, { removeItem }] = useLocalStorageState<CheckoutData>("checkout_data", {
    defaultValue: {},
  })

  return { checkoutData, setCheckoutData, removeItem }
}
