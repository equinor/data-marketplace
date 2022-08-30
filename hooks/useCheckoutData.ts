import useLocalStorageState from "use-local-storage-state"

type CheckoutData = {
  asset?: Pick<Collibra.Asset, "id"|"name">
  terms?: {
    termsAccepted:boolean
  }
  access?: {
    description: string
  }
}

export const useCheckoutData = () => {
  const [checkoutData, setCheckoutData, { removeItem }] = useLocalStorageState<CheckoutData>("checkout_data", {
    defaultValue: {},
  })

  return { checkoutData, setCheckoutData, removeItem }
}
