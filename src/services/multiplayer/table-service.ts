import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {applyNodeChanges, NodeChange} from "reactflow";
import {IErdNode} from "@/types/erd-node";

export const tableService = () => {

  function onAdd(data: IErdNode) {
    useErdDiagramStore.setState(cur => ({tables: [...cur.tables, data]}))
  }

  function onUpdate(data: NodeChange) {
    useErdDiagramStore.setState(cur => ({tables: applyNodeChanges([data], cur.tables)}))
  }

  function onDelete(data: string) {
    useErdDiagramStore.setState(cur => ({tables: cur.tables.filter(t => t.id !== data)}))
  }

  function onSet({tableId, data}: any) {
    useErdDiagramStore.setState(cur => ({
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
