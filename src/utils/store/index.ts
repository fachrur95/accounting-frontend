import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// import { createCheckoutSlice, type CheckoutSlice } from './slices/checkoutSlice'
import { appPersistSlice, type IAppPersistSlice } from './slices/appPersist'
import { appUnPersistSlice, type IAppUnPersistSlice } from './slices/appUnPersist'

type StoreState = IAppPersistSlice & IAppUnPersistSlice

export const useAppStore = create<StoreState>()(persist((...params) => ({
  ...appPersistSlice(...params),
  ...appUnPersistSlice(...params),
  // ...createCheckoutSlice(...params),
}), {
  name: "gogabook-app",
  partialize: (state) => ({
    openMenu: state.openMenu,
  })
}))