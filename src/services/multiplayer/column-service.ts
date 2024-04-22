import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {orderBy} from "lodash";
import {EntityNodeColumn, EntityNodeData} from "@/types/entity-node";

export type ColumnWebsocketPatch = {
  entityId: string
  columnId: string
  key: keyof EntityNodeColumn
  value: any
}

export const columnService = () => {

  function onAdd(column: EntityNodeColumn) {
    usePlaygroundStore.setState(cur => ({
      nodes: cur.nodes.map(node => {
        if (node.id === column.entityId) {
          const entityData = node.data as EntityNodeData
          return {
            ...node,
            data: {
              ...entityData,
              columns: [...entityData.columns, column]
            }
          }
        }
        return node
      })
    }))
  }

  function onPatch(data: ColumnWebsocketPatch) {
    usePlaygroundStore.setState(state => ({
      nodes: state.nodes.map(node => {
        if (node.id === data.entityId) {
          const entityData = node.data as EntityNodeData
          let columns: EntityNodeColumn[]

          if (data.key === "order") {
            columns = orderBy(entityData.columns.map(c => c.id === data.columnId ? {...c, [data.key]: data.value} : c), 'order', 'asc')
          } else {
            columns = entityData.columns.map(c => c.id === data.columnId ? {...c, [data.key]: data.value} : c)
          }
          return {
            ...node,
            data: {
              ...node.data,
              columns
            }
          }
        }
        return node
      })
    }))
  }

  function onDelete(columnId: string[], entityId: string) {
    usePlaygroundStore.setState(cur => ({
      nodes: cur.nodes.map(node => {
        if (node.id === entityId) {
          const entityData = node.data as EntityNodeData
          return {
            ...node,
            data: {
              ...entityData,
              columns: entityData.columns.filter(c => !columnId.includes(c.id))
            }
          }
        }
        return node
      })
    }))
  }

  return {
    onAdd,
    onPatch,
    onDelete,
  }
}
