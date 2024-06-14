import ButtonWithConfirm from "@/components/common/ButtonWithConfirm"
import { usePlaygroundStore } from "@/contexts/playground/PlaygroundStoreContext.ts"
import { ColumnEnum } from "@/enums/playground.ts"
import { useEntityNodeData } from "@/hooks/useEntityNodeData.ts"
import { ActionIcon, Indicator, Tooltip } from "@mantine/core"
import { IconRowInsertTop, IconTrash } from "@tabler/icons-react"
import { useReactFlow } from "@xyflow/react"
import { useCallback, useMemo } from "react"

export const RowControls = () => {
  const store = usePlaygroundStore()
  const reactflow = useReactFlow()
  const {addDefaultColumn, addPrimaryColumn, deleteColumn, playground} = store.getState()
  const {data, id} = useEntityNodeData()
  const handleAddColumn = () => addDefaultColumn(id)
  const handleAddPrimaryColumn = () => addPrimaryColumn(id)
  const selectedColumns = useMemo(() => {
    return data.columns.filter(column => column.selected)
  }, [data.columns])

  const handleDeleteSelectedRows = useCallback(async () => {
    const columnsToDelete = selectedColumns.map(column => column.id)
    const foreignKeyColumns = selectedColumns.filter(column => column.foreignKey)

    if (foreignKeyColumns.length) {
      await reactflow.deleteElements({
        edges: foreignKeyColumns.map(column => ({id: column.id}))
      })
    }

    const data = {
      columnId: columnsToDelete,
      entityId: id
    }

    const columnDeleteResponse = playground.handleEmitResponse({
      onError: playground.notifyErrorMessage(ColumnEnum.delete, "Failed to delete column"),
      onSuccess: () => deleteColumn(data)
    })

    playground.socket.emit(ColumnEnum.delete, data, columnDeleteResponse)

  }, [selectedColumns, playground])

  if (selectedColumns.length) {
    return (
      <ButtonWithConfirm
        isDanger
        tooltip={`Delete selected columns`}
        target={(
          <Indicator label={selectedColumns.length} size={15} color="red">
            <ActionIcon size={"lg"}>
              <IconTrash color={"var(--mantine-color-red-5)"} stroke={1}/>
            </ActionIcon>
          </Indicator>
        )}
        message={`Are you sure want to delete ${selectedColumns.length} ${selectedColumns.length > 1 ? "selected columns" : "selected column"}`}
        onConfirm={handleDeleteSelectedRows}
      />
    )
  }

  return (
    <>
      <Tooltip label={"Add primary row"}>
        <ActionIcon onClick={handleAddPrimaryColumn} size={"lg"}>
          <IconRowInsertTop color={"var(--mantine-color-yellow-5)"}/>
        </ActionIcon>
      </Tooltip>
      <Tooltip label={"Add row"}>
        <ActionIcon onClick={handleAddColumn} size={"lg"}>
          <IconRowInsertTop color={"var(--mantine-color-text)"}/>
        </ActionIcon>
      </Tooltip>
    </>
  )
}
