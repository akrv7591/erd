import {createContext, useContext} from "react";
import {createDiagramStore, DiagramStore} from "src/stores/diagram-store";
import {useStoreWithEqualityFn} from "zustand/traditional";

export type DiagramContext = ReturnType<typeof createDiagramStore>

export const DiagramContext = createContext<DiagramContext>({} as DiagramContext)

export const useDiagramStore = <T>(
  selector: (state: DiagramStore) => T,
  equalityFn?: (a: T, b: T) => boolean
): T => {
  const store = useContext(DiagramContext)
  return useStoreWithEqualityFn(store, selector, equalityFn)
}
