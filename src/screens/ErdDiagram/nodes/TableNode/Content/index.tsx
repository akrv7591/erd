import {ActionIcon, Collapse, Divider, Group, Stack, Tooltip,} from "@mantine/core";
import React from "react";
import {IconTrash} from "@tabler/icons-react";
import RenderItem from "./RenderItem.tsx";
import {ReactSortable} from "react-sortablejs";
import styles from "./style.module.css"
import "./style.module.css"
import RenderList from "./RenderList.tsx";
import ButtonWithConfirm from "../../../../../components/common/ButtonWithConfirm";
import {useNodeId} from "reactflow";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {Column} from "@/enums/playground.ts";
import {IErdNodeColumn} from "@/types/erd-node";
import isEqual from "lodash/isEqual";
import {useNodeData} from "@/hooks/useNodeData.ts";

const Content = React.memo(() => {
  const data = useNodeData()
  const selectedColumns = React.useMemo(() => data.columns.filter(column => column.selected), [data.columns])
  const tableId = useNodeId()
  const playground = usePlayground()
  const onDelete = React.useCallback(() => {
    if (!tableId) return
    selectedColumns.forEach((column) => {
      playground.column(Column.delete, column)
    })
  }, [selectedColumns])

  const setSortedColumns = (columns: IErdNodeColumn[]) => {
    const orderedColumns = columns.map((column, order) => ({
      ...column,
      order: order
    }))
    const objectsNotEqual = orderedColumns.filter((newColumn) => !data.columns.some((oldColumn) => isEqual(newColumn, oldColumn)));

    objectsNotEqual.forEach((column) => {
      playground.column(Column.update, column)
    })
  }

  return (
    <Stack style={{position: "relative"}}>
      <ReactSortable
        tag={RenderList}
        list={data.columns}
        dragClass={styles.ghostRowClass}
        ghostClass={styles.tableRowDrag}
        chosenClass={styles.tableRowDrag}
        setList={setSortedColumns}
        multiDrag
        handle={".handle"}
      >
        {data.columns.map((item) => (
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
            message={`Do you want to delete ${selectedColumns.length} ${selectedColumns.length > 1? "columns": "column"}`}
            onConfirm={onDelete}
          />
        </Collapse>
      </Group>
    </Stack>
  )
})

export default Content
