import {ActionIcon, Indicator, Tooltip} from "@mantine/core"
import {IconRowInsertTop, IconTrash} from "@tabler/icons-react"
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import {memo, useCallback} from "react";
import {useShallow} from "zustand/react/shallow";

export const RowControls = memo(() => {
  const actions = useSharedDiagramStore(useShallow(state => ({
    addDefaultColumn: state.addDefaultColumn,
    addPrimaryColumn: state.addPrimaryColumn,
    deleteSelectedColumns: state.deleteSelectedColumns
  })))
  const nodeData = useEntityNodeData()

  const handleAddPrimaryColumn = useCallback(() => {
    actions.addPrimaryColumn(nodeData.id)
  }, [])

  const handleAddColumn = useCallback(() => {
    actions.addDefaultColumn(nodeData.id)
  }, [])

  const handleDeleteSelectedColumns = useCallback(() => {
    actions.deleteSelectedColumns(nodeData.id)
  }, [])

  const selectedColumns = nodeData.columns.filter(column => column.selected)

  if (selectedColumns.length) {
    return (
      <ButtonWithConfirm
        isDanger
        tooltip={`Delete selected rows`}
        target={(
          <Indicator label={selectedColumns.length} size={15} color="red">
            <ActionIcon size={"lg"}>
              <IconTrash color={"var(--mantine-color-red-5)"} stroke={1}/>
            </ActionIcon>
          </Indicator>
        )}
        message={`Are you sure want to delete ${selectedColumns.length} ${selectedColumns.length > 1 ? "selected columns" : "selected column"}`}
        onConfirm={handleDeleteSelectedColumns}
      />
    )
  }


  return (
    <>
      <Tooltip label={"Add primary row"}>
        <ActionIcon onClick={handleAddPrimaryColumn} size={36}>
          <IconRowInsertTop color={"var(--mantine-color-yellow-5)"}/>
        </ActionIcon>
      </Tooltip>
      <Tooltip label={"Add row"}>
        <ActionIcon onClick={handleAddColumn} size={36}>
          <IconRowInsertTop color={"var(--mantine-color-text)"}/>
        </ActionIcon>
      </Tooltip>
    </>
  )
})
