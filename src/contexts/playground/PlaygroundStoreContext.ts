import {createContext, useContext} from "react";
import {createPlaygroundStore, PlaygroundStore as Store} from "@/stores/playgroundStore.ts";
import {useStore} from "zustand";

export type PlaygroundStore = ReturnType<typeof createPlaygroundStore>

export const PlaygroundStoreContext = createContext<PlaygroundStore | null>(null)
export const usePlaygroundStore = () => {
  const store = useContext(PlaygroundStoreContext)

  if (!store) {
    throw new Error("usePlaygroundStore must be used within a PlaygroundStoreProvider")
  }

  return store
}

export const usePlayground = <T>(
  selector: (state: Store) => T,
): T => {
  const store = useContext(PlaygroundStoreContext)

  if (!store) {
    throw new Error("usePlaygroundStore must be used within a PlaygroundStoreProvider")
  }

  return useStore(store, selector)
}
