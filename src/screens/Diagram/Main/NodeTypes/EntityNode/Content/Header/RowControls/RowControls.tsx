import {ActionIcon, Indicator, Tooltip} from "@mantine/core"
import {IconRowInsertTop, IconTrash} from "@tabler/icons-react"
import {ButtonWithConfirm} from "@/components/common/ButtonWithConfirm";
import {memo, useCallback, useMemo} from "react";
import {useDiagramStore, useEntityNode} from "@/hooks";
import {DEFAULT_COLUMN_DATA} from "@/constants/diagram/column";
import {ShortId} from "@/utility/ShortId";

export const RowControls = memo(() => {
  const {data: entityData, id: entityId} = useEntityNode()
  const addColumn = useDiagramStore(state => state.addEntityColumn)
  const deleteColumns = useDiagramStore(state => state.deleteEntityColumn)

  const handleAddPrimaryColumn = useCallback(() => {
    addColumn({
      ...DEFAULT_COLUMN_DATA,
      id: ShortId.create(),
      entityId,
      primary: true,
      unique: true,
      notNull: true,
    })
  }, [])

  const handleAddColumn = useCallback(() => {
    addColumn({
      ...DEFAULT_COLUMN_DATA,
      id: ShortId.create(),
      entityId,
    })
  }, [])

  const selectedColumns = useMemo(() => {
    return entityData.columns.filter(column => column.selected)
  }, [entityData.columns])

  const handleDeleteSelectedColumns = useCallback(() => {
    deleteColumns(selectedColumns.map(({id: columnId}) => ({
      entityId,
      columnId
    })))
  }, [selectedColumns])

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
