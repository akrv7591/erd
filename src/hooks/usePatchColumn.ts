import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {PlaygroundStore} from "@/stores/playgroundStore.ts";
import {EntityNodeColumn} from "@/types/entity-node";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import {useCallback} from "react";
import {ColumnEnum} from "@/enums/playground.ts";
import {useShallow} from "zustand/react/shallow";

const selector = (state: PlaygroundStore) => ({
  patchColumn: state.patchColumn,
  playground: state.playground
})

export const usePatchColumn = (columnId: string) => {
  const store = usePlayground(useShallow(selector))
  const {id: entityId} = useEntityNodeData()

  const patchColumn = useCallback(<K extends keyof EntityNodeColumn>(key: K, value: EntityNodeColumn[K]) => {
    const columnPatchResponse = store.playground.handleEmitResponse({
      onError: store.playground.notifyErrorMessage(ColumnEnum.patch, "Failed to patch column"),
      onSuccess: () => {}
    })

    const obj = {
      entityId,
      columnId,
      key,
      value
    }

    if (key !== "selected") {
      store.playground.socket.emit(ColumnEnum.patch, obj, columnPatchResponse)
    }

    store.patchColumn(obj)
  }, [])

  return {patchColumn}
}
