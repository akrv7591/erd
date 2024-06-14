import {Stack} from "@mantine/core";
import React, {useCallback} from "react";
import {Row} from "./Row";
import {ReactSortable} from "react-sortablejs";
import styles from "./style.module.css"
import {Header} from "./Header";
import {ColumnEnum} from "@/enums/playground.ts";
import isEqual from "lodash/isEqual";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import {EntityNodeColumn} from "@/types/entity-node";
import {usePlayground, usePlaygroundStore} from "@/contexts/playground/PlaygroundStoreContext.ts";

export const Table = React.memo(() => {
  const nodeData = useEntityNodeData()
  const playground = usePlayground(state => state.playground)
  const store = usePlaygroundStore()
  const {patchColumn} = store.getState()

  const setSortedColumns = useCallback((columns: EntityNodeColumn[]) => {
    if (!nodeData) {
      return
    }

    let orderedColumns = columns.map((column, order) => ({
      ...column,
      order: order
    }))

    const objectsNotEqual = orderedColumns.filter((newColumn) => !nodeData.data.columns.some((oldColumn) => isEqual(newColumn, oldColumn)));

    objectsNotEqual.forEach((column) => {
      const data = {
        columnId: column.id,
        entityId: column.entityId,
        key: "order",
        value: column.order
      } as const
      const columnPatchResponse = playground.handleEmitResponse({
        onError: playground.notifyErrorMessage(ColumnEnum.patch, "Failed to patch column"),
        onSuccess: () => {}
      })
      patchColumn(data)

      playground.socket.emit(ColumnEnum.patch, data, columnPatchResponse)
    })
  }, [nodeData])

  if (!nodeData) {
    return null
  }

  return (
    <Stack style={{position: "relative"}} gap={0}>
      <ReactSortable
        tag={Header}
        list={nodeData.data.columns}
        dragClass={styles.ghostRowClass}
        ghostClass={styles.tableRowDrag}
        chosenClass={styles.tableRowDrag}
        setList={setSortedColumns}
        multiDrag
        handle={".handle"}
      >
        {nodeData.data.columns.map((item) => (
          <Row key={item.id} data={item}/>
        ))}
      </ReactSortable>
    </Stack>
  )
})
