import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {orderBy} from "lodash";

export const columnService = () => {

  function onAdd({column}: any) {
    usePlaygroundStore.setState(cur => ({
      entities: cur.entities.map(entity => {
        if (entity.id === column.entityId) {
          return {
            ...entity,
            data: {
              ...entity.data,
              columns: [...entity.data.columns, column]
            }
          }
        }
        return entity
      })
    }))
  }

  function onUpdate({column}: any) {
    usePlaygroundStore.setState(cur => ({
      entities: cur.entities.map(entity => {
        if (entity.id === column.entityId) {
          const columns = orderBy(entity.data.columns.map(c => c.id === column.id ? {...c, [column.key]: column.value} : c), 'order', 'asc')
          return {
            ...entity,
            data: {
              ...entity.data,
              columns
            }
          }
        }
        return entity
      })
    }))
  }

  function onDelete({column}: any) {
    usePlaygroundStore.setState(cur => ({
      entities: cur.entities.map(entity => {
        if (entity.id === column.entityId) {
          return {
            ...entity,
            data: {
              ...entity.data,
              columns: entity.data.columns.filter(c => c.id !== column.id)
            }
          }
        }
        return entity
      })
    }))
  }

  return {
    onAdd,
    onUpdate,
    onDelete,
  }
}
