import {Stack} from "@mantine/core";
import React, {useCallback} from "react";
import {Row} from "./Row";
import {ReactSortable} from "react-sortablejs";
import {Header} from "./Header";
import {useEntityNodeData} from "@/hooks/useEntityNodeData";
import styles from "./style.module.css"
import {EntityColumn} from "@/providers/shared-diagram-store-provider/type.ts";

export const Table = React.memo(() => {
  const nodeData = useEntityNodeData()
  const setSortedColumns = useCallback((columns: EntityColumn[]) => {
    nodeData.setData({
      columns: Object.fromEntries(columns.map((column, order) => [column.id, {...column, order}])),
    })
  }, [nodeData.columns])

  if (!nodeData) {
    return null
  }

  return (
    <Stack style={{position: "relative"}} gap={0}>
      <ReactSortable
        tag={Header}
        list={nodeData.columns}
        dragClass={styles.ghostRowClass}
        ghostClass={styles.tableRowDrag}
        chosenClass={styles.tableRowDrag}
        setList={setSortedColumns}
        multiDrag
        handle={".handle"}
      >
        {nodeData.columns.map((row) => (
          <Row key={row.id} data={row}/>
        ))}
      </ReactSortable>
    </Stack>
  )
})
