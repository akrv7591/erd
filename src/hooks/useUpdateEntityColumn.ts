import {useEntityNode} from "./useEntityNode";
import {useCallback} from "react";
import {EntityColumn} from "@/types/diagram";
import {useDiagramStore} from "@/hooks/useDiagramStore";

export const useUpdateEntityColumn = (columnId: string) => {
  const updateColumn = useDiagramStore(state => state.updateEntityColumn)
  const {id: entityId} = useEntityNode()
  return useCallback((key: keyof EntityColumn, value: EntityColumn[keyof EntityColumn]) => {
    updateColumn({
      entityId,
      columnId,
      key,
      value
    })
  }, [])

}
