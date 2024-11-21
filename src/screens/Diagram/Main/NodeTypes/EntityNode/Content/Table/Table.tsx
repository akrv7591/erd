import React, {useCallback} from "react";
import {Row} from "./Row";
import {ReactSortable} from "react-sortablejs";
import {Header} from "./Header";
import styles from "./style.module.css"
import {EntityColumn} from "@/types/diagram";
import {useEntityColumns, useEntityNode} from "@/hooks";
import { shallowEqual } from "@mantine/hooks";

export const Table = React.memo(() => {
  const {data} = useEntityNode()
  const {updateColumnsOrder} = useEntityColumns()

  const setSortedColumns = useCallback((updatedColumns: EntityColumn[]) => {
    if (shallowEqual(data.columns, updatedColumns)) {
      return
    }

    const oldOrder = data.columns.map(column => column.id)
    const newOrder = updatedColumns.map(column => column.id)

    updateColumnsOrder(oldOrder, newOrder)

  }, [data.columns, updateColumnsOrder])


  return (
    <ReactSortable
      tag={Header}
      list={data.columns}
      dragClass={styles.ghostRowClass}
      ghostClass={styles.tableRowDrag}
      chosenClass={styles.tableRowDrag}
      setList={setSortedColumns}
      handle={".handle"}
    >
      {data.columns.map((row) => (
        <Row key={row.id} data={row}/>
      ))}
    </ReactSortable>
  )
})
