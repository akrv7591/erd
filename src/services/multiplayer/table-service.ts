import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {applyNodeChanges, NodeChange} from "reactflow";
import {ITableNode} from "@/types/table-node";

export const tableService = () => {

  function onAdd(data: ITableNode) {
    usePlaygroundStore.setState(cur => ({tables: [...cur.tables, data]}))
  }

  function onUpdate(data: NodeChange) {
    usePlaygroundStore.setState(cur => ({tables: applyNodeChanges([data], cur.tables)}))
  }

  function onDelete(data: string) {
    usePlaygroundStore.setState(cur => ({tables: cur.tables.filter(t => t.id !== data)}))
  }

  function onSet({tableId, data}: any) {
    usePlaygroundStore.setState(cur => ({
      tables: cur.tables.map(t => t.id === tableId ? {
        ...t,
        data: {...t.data, ...data}
      } : t)
    }))
  }

  return {
    onAdd,
    onUpdate,
    onDelete,
    onSet
  }

}
