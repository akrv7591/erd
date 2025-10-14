import React, {useCallback} from "react";
import {Row} from "./Row";
import {ReactSortable} from "react-sortablejs";
import {Header} from "./Header";
import styles from "./style.module.css"
import {EntityColumn} from "@/types/diagram";
import {useEntityColumns} from "@/hooks/useEntityColumns";
import { shallowEqual } from "@mantine/hooks";
import { useEntityStoreData } from "@/hooks/useEntityData";

export const Table = React.memo(() => {
  const columns = useEntityStoreData(state => state.columns)
  const {updateColumnsOrder} = useEntityColumns()
  const setSortedColumns = useCallback((updatedColumns: EntityColumn[]) => {
    if (shallowEqual(columns, updatedColumns)) {
      return
    }

    const oldOrder = columns.map(column => column.id)
    const newOrder = updatedColumns.map(column => column.id)

    updateColumnsOrder(oldOrder, newOrder)

  }, [columns, updateColumnsOrder])

  console.log("RENDERING TABLE")

  return (
    <ReactSortable
      tag={Header}
      list={columns}
      dragClass={styles.ghostRowClass}
      ghostClass={styles.tableRowDrag}
      chosenClass={styles.tableRowDrag}
      setList={setSortedColumns}
      handle={".handle"}
    >
      {columns.map((row) => (
        <Row key={row.id} data={row}/>
      ))}
    </ReactSortable>
  )
})
