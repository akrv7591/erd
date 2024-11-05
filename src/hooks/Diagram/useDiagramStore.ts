import {DiagramStore} from "@/stores/diagram-store";
import {useContext} from "react";
import {useStoreWithEqualityFn} from "zustand/traditional";
import {DiagramContext} from "@/contexts/DiagramContext";

const useDiagramStoreApi = () => {
  const store = useContext(DiagramContext)

  if (!store) {
    throw new Error("useDiagramStoreApi must be used within a DiagramProvider")
  }

  return store
}


const useDiagramStore = <T>(
  selector: (state: DiagramStore) => T,
  equalityFn?: (a: T, b: T) => boolean
): T => {
  const store = useDiagramStoreApi()
  return useStoreWithEqualityFn(store, selector, equalityFn)
}

export {
  useDiagramStoreApi,
  useDiagramStore
}
