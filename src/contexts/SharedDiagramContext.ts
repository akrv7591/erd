import {createContext, useContext} from "react";
import {useStoreWithEqualityFn} from "zustand/traditional";
import {SharedDiagramStore} from "src/stores/shared-diagram-store";
import {createSharedDiagramStore} from "src/stores/shared-diagram-store"

export type SharedDiagramContext = ReturnType<typeof createSharedDiagramStore>

export const SharedDiagramContext = createContext<SharedDiagramContext>({} as SharedDiagramContext)

export const useSharedDiagramStoreApi = () => useContext(SharedDiagramContext)

export const useSharedDiagramStore = <T>(
  selector: (state: SharedDiagramStore) => T,
  equalityFn?: (a: T, b: T) => boolean
): T => {
  const store = useContext(SharedDiagramContext)
  return useStoreWithEqualityFn(store, selector, equalityFn)
}
