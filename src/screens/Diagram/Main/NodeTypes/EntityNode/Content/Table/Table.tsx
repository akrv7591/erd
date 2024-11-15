import React, {useCallback} from "react";
import {Row} from "./Row";
import {ReactSortable} from "react-sortablejs";
import {Header} from "./Header";
import styles from "./style.module.css"
import {EntityColumn} from "@/types/diagram";
import {useDiagramStore, useEntityNode} from "@/hooks";
import {isEqual} from "lodash";

export const Table = React.memo(() => {
  const {data, id} = useEntityNode()
  const onChange = useDiagramStore(state => state.updateEntityData)

  const setSortedColumns = useCallback((updatedColumns: EntityColumn[]) => {
    if (isEqual(data.columns, updatedColumns)) {
      return {}
    }
    onChange(id, {
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
