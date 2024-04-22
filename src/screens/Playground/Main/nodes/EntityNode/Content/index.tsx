import {ActionIcon, Collapse, Divider, Group, Stack,} from "@mantine/core";
import React, {useCallback} from "react";
import {IconTrash} from "@tabler/icons-react";
import RenderItem from "./TableRow.tsx";
import {ReactSortable} from "react-sortablejs";
import styles from "./style.module.css"
import "./style.module.css"
import RenderList from "./Table.tsx";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {useReactFlow} from "@xyflow/react";
import {ColumnEnum} from "@/enums/playground.ts";
import isEqual from "lodash/isEqual";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import {EntityNodeColumn} from "@/types/entity-node";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";

const Content = React.memo(() => {
  const nodeData = useEntityNodeData()
  const playground = usePlaygroundStore(state => state.playground)
  const reactflow = useReactFlow()

  const selectedColumns = React.useMemo(() => {
    return nodeData.data.columns.filter(column => column.selected)
  }, [nodeData])

  const onDelete = React.useCallback(async () => {
    const columnsToDelete = selectedColumns.map(column => column.id)
    const foreignKeyColumns = selectedColumns.filter(column => column.foreignKey)

    if (foreignKeyColumns.length) {
      await reactflow.deleteElements({
        edges: foreignKeyColumns.map(column => ({id: column.id}))
      })
    }

    playground.column(ColumnEnum.delete, columnsToDelete, nodeData.id)


  }, [selectedColumns, reactflow, playground])

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
      playground.column(ColumnEnum.patch, {
        columnId: column.id,
        entityId: column.entityId,
        key: "order",
        value: column.order
      })
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
          <RenderItem key={item.id} data={item}/>
        ))}
      </ReactSortable>
      <Divider w={"100%"}/>

      <Group mt={"sm"}>
        <Collapse in={selectedColumns.length > 0}>
          <ButtonWithConfirm
            isDanger
            tooltip={`Delete ${selectedColumns.length} columns`}
            target={(
              <ActionIcon color={"red"} variant={"filled"}>
                <IconTrash stroke={1}/>
              </ActionIcon>
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
