import {orderBy} from "lodash";
import {CallbackDataStatus, ColumnEnum} from "@/enums/playground.ts";
import type {MultiplayerService} from "@/services/multiplayer/type";
import type {EntityNodeColumn, EntityNodeData} from "@/types/entity-node";

export const columnService: MultiplayerService = ({store, socket}) => {
  const set = store.setState

  socket.on(ColumnEnum.add, (data, callback) => {
    console.log(data.column)
    try {
      set(cur => ({
        nodes: cur.nodes.map(node => {

          if (node.id !== data.column.entityId) return node

          const entityData = node.data as EntityNodeData

          return {
            ...node,
            data: {
              ...entityData,
              columns: [...entityData.columns, data.column]
            }
          }
        })
      }))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(ColumnEnum.patch, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(ColumnEnum.patch, (data, callback) => {
    try {
      set(state => ({
        nodes: state.nodes.map(node => {
          if (node.id === data.entityId) {
            const entityData = node.data as EntityNodeData
            let columns: EntityNodeColumn[]

            if (data.key === "order") {
              columns = orderBy(entityData.columns.map(c => c.id === data.columnId ? {
                ...c,
                [data.key]: data.value
              } : c), 'order', 'asc')
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
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(ColumnEnum.patch, e)
      callback(CallbackDataStatus.FAILED)
    }
  })

  socket.on(ColumnEnum.delete, (data, callback) => {
    try {
      set(cur => ({
        nodes: cur.nodes.map(node => {
          if (node.id === data.entityId) {
            const entityData = node.data as EntityNodeData
            return {
              ...node,
              data: {
                ...entityData,
                columns: entityData.columns.filter(c => !data.columnId.includes(c.id))
              }
            }
          }
          return node
        })
      }))
      callback(CallbackDataStatus.OK)
    } catch (e) {
      console.error(ColumnEnum.patch, e)
      callback(CallbackDataStatus.FAILED)
    }
  })
}
