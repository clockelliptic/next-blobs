import { writable } from "svelte/store"
/*
        For storing and restoring app state when using stripe checkout
    */
export const authRouteState = writable({
  nonce: null,
  path: null,
  query: null,
})
