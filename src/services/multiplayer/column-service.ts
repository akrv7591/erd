import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {orderBy} from "lodash";

export const columnService = () => {

  function onAdd({column}: any) {
    usePlaygroundStore.setState(cur => ({
      tables: cur.tables.map(table => {
        if (table.id === column.tableId) {
          return {
            ...table,
            data: {
              ...table.data,
              columns: [...table.data.columns, column]
            }
          }
        }
        return table
      })
    }))
  }

  function onUpdate({column}: any) {
    usePlaygroundStore.setState(cur => ({
      tables: cur.tables.map(table => {
        if (table.id === column.tableId) {
          const columns = orderBy(table.data.columns.map(c => c.id === column.id ? column : c), 'order', 'asc')
          return {
            ...table,
            data: {
              ...table.data,
              columns
            }
          }
        }
        return table
      })
    }))
  }

  function onDelete({column}: any) {
    usePlaygroundStore.setState(cur => ({
      tables: cur.tables.map(table => {
        if (table.id === column.tableId) {
          return {
            ...table,
            data: {
              ...table.data,
              columns: table.data.columns.filter(c => c.id !== column.id)
            }
          }
        }
        return table
      })
    }))
  }

  return {
    onAdd,
    onUpdate,
    onDelete,
  }
}
