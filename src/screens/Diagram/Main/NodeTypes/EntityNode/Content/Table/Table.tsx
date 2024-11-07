import React, {useCallback} from "react";
import {Row} from "./Row";
import {ReactSortable} from "react-sortablejs";
import {Header} from "./Header";
import styles from "./style.module.css"
import {EntityColumn} from "@/types/diagram";
import {useEntityNode} from "@/hooks";
import {isEqual} from "lodash";

export const Table = React.memo(() => {
  const {onChange, data} = useEntityNode()

  const setSortedColumns = useCallback((updatedColumns: EntityColumn[]) => {
    if (isEqual(data.columns, updatedColumns)) {
      return {}
    }
    onChange({
      columns: updatedColumns
    })
  }, [data.columns])


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
