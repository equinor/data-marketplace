import useLocalStorageState from "use-local-storage-state"

type CheckoutData = {
  terms?: {
    termsAccepted:boolean
  },
  access?: {
    description: string
  }
}

export const useCheckoutData = () => {
  const [checkoutData, setCheckoutData] = useLocalStorageState<CheckoutData>("checkout_test", {
    defaultValue: {},
  })
  return { checkoutData, setCheckoutData }
}
