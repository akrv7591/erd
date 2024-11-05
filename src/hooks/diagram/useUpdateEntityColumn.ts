import {useEntityNode} from "@/hooks";
import {useCallback} from "react";
import {EntityColumn} from "@/types/diagram";

export const useUpdateEntityColumn = (id: string) => {
  const {onChange} = useEntityNode()
  return useCallback((key: keyof EntityColumn, value: EntityColumn[keyof EntityColumn]) => {
    onChange(({columns}) => {
      return {
        columns: columns.map(column => {
          if (column.id !== id) {
            return column
          }

          return {
            ...column,
            [key]: value
          }
        })
      }
    }, key !== "selected")
  }, [])

}
