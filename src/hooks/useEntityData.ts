import { EntityDateContext } from "@/contexts/EntityDataContext"
import { EntityStore } from "@/stores/entity-store"
import { useCallback, useContext } from "react"
import { useStoreWithEqualityFn } from "zustand/traditional"
import { useDiagramStore } from "./useDiagramStore"
import { NODE } from "@/namespaces/broadcast/node"
import { useNodeId } from "./useNodeId"

export const useEntityStoreApi = () => {
  const store = useContext(EntityDateContext)

  if (!store) {
    throw new Error("useDiagramStoreApi must be used within a DiagramProvider")
  }

  return store
}

export const useEntityStoreData = <T>(
  selector: (state: EntityStore) => T,
  equalityFn?: (a: T, b: T) => boolean
): T => {
  const store = useEntityStoreApi()
  return useStoreWithEqualityFn(store, selector, equalityFn)
}

export const useUpdateEntityColor = () => {
  const id = useNodeId()
  const handleDataChange = useDiagramStore(state => state.handleDataChange)
  const entityStoreApi = useEntityStoreApi()

  return useCallback((newValue: string) => {
    const current: NODE.ENTITY.COLOR_UPDATE[] = [{
      type: NODE.ENTITY.TYPE.COLOR_UPDATE,
      value: {
        id,
        color: entityStoreApi.getState().color
      }
    }]

    const updates: NODE.ENTITY.COLOR_UPDATE[] = [{
      type: NODE.ENTITY.TYPE.COLOR_UPDATE,
      value: {
        id,
        color: newValue
      }
    }]

    handleDataChange({
      updates,
      current
    })

  }, [])
}

export const useUpdateEntityName = () => {
  const id = useNodeId()
  const handleDataChange = useDiagramStore(state => state.handleDataChange)
  const entityStoreApi = useEntityStoreApi()
  return useCallback((newValue: string) => {
    const current: NODE.ENTITY.NAME_UPDATE[] = [{
      type: NODE.ENTITY.TYPE.NAME_UPDATE,
      value: {
        id,
        name: entityStoreApi.getState().name
      }
    }]

    const updates: NODE.ENTITY.NAME_UPDATE[] = [{
      type: NODE.ENTITY.TYPE.NAME_UPDATE,
      value: {
        id,
        name: newValue
      }
    }]

    handleDataChange({
      updates,
      current
    })
  }, [])
}