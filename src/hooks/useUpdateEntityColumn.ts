import {useCallback} from "react";
import {EntityColumn} from "@/types/diagram";
import { useEntityColumns } from "./useEntityColumns";

export const useUpdateEntityColumn = (id: string) => {
  const { updateColumn } = useEntityColumns()

  return useCallback((key: keyof EntityColumn, value: EntityColumn[keyof EntityColumn], oldValue: EntityColumn[keyof EntityColumn]) => {
    const old = [{
      id,
      key,
      value: oldValue
    }]
    const updated = [{
      id,
      key,
      value
    }]
    updateColumn(old, updated)
  }, [])

}
