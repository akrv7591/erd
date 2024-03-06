import {ActionIcon, Collapse, Divider, Group, Stack, Tooltip,} from "@mantine/core";
import React, {useCallback} from "react";
import {IconTrash} from "@tabler/icons-react";
import RenderItem from "./TableRow.tsx";
import {ReactSortable} from "react-sortablejs";
import styles from "./style.module.css"
import "./style.module.css"
import RenderList from "./Table.tsx";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {useNodeId} from "@xyflow/react";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {Column} from "@/enums/playground.ts";
import isEqual from "lodash/isEqual";
import {useNodeData} from "@/hooks/useNodeData.ts";
import {ITableNodeColumn} from "@/types/table-node";

const Content = React.memo(() => {
  const nodeData = useNodeData()
  const tableId = useNodeId()
  const playground = usePlayground()

  const selectedColumns = React.useMemo(() => {
    if (!nodeData) {
      return []
    }
    return nodeData.data.columns.filter(column => column.selected)
  }, [nodeData])

  const onDelete = React.useCallback(() => {
    if (!tableId) return
    selectedColumns.forEach((column) => {
      playground.column(Column.delete, column)
    })
  }, [selectedColumns])

  const setSortedColumns = useCallback((columns: ITableNodeColumn[]) => {
    if (!nodeData) {
      return
    }

    let orderedColumns = columns.map((column, order) => ({
      ...column,
      order: order
    }))

    const objectsNotEqual = orderedColumns.filter((newColumn) => !nodeData.data.columns.some((oldColumn) => isEqual(newColumn, oldColumn)));

    objectsNotEqual.forEach((column) => {
      playground.column(Column.update, {id: column.id, tableId: column.tableId, key: "order", value: column.order})
    })
  }, [nodeData])

  if (!nodeData) {
    return null
  }

  return (
    <Stack style={{position: "relative"}} gap={0}>
      <ReactSortable
        tag={RenderList}
        list={nodeData.data.columns}
        dragClass={styles.ghostRowClass}
        ghostClass={styles.tableRowDrag}
        chosenClass={styles.tableRowDrag}
        setList={setSortedColumns}
        multiDrag
        handle={".handle"}
      >
        {nodeData.data.columns.map((item) => (
          <RenderItem key={item.id + item.order} data={item}/>
        ))}
      </ReactSortable>
      <Divider w={"100%"}/>

      <Group mt={"sm"}>
        <Collapse in={selectedColumns.length > 0}>
          <ButtonWithConfirm
            isDanger
            target={(
              <Tooltip label={`Delete ${selectedColumns.length} columns`}>
                <ActionIcon color={"red"} variant={"filled"}>
                  <IconTrash stroke={1}/>
                </ActionIcon>
              </Tooltip>
            )}
            message={`Do you want to delete ${selectedColumns.length} ${selectedColumns.length > 1 ? "columns" : "column"}`}
            onConfirm={onDelete}
          />
        </Collapse>
      </Group>
    </Stack>
  )
})

export default Content
