import {ActionIcon, Indicator, Tooltip} from "@mantine/core"
import {IconRowInsertTop, IconTrash} from "@tabler/icons-react"
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {memo, useCallback, useMemo} from "react";
import {useEntityNode} from "@/hooks";
import {createId} from "@paralleldrive/cuid2";
import {DEFAULT_COLUMN_DATA} from "@/constants/diagram/column";

export const RowControls = memo(() => {
  const {data: entityData, id: entityId, onChange} = useEntityNode()

  const handleAddPrimaryColumn = useCallback(() => {
    onChange(({columns}) => {
      const id = createId()

      return {
        columns: [...columns, {
          ...DEFAULT_COLUMN_DATA,
          id,
          entityId,
          order: Object.keys(columns).length,
          primary: true,
          unique: true,
          notNull: true,
        }]
      }
    })
  }, [])

  const handleAddColumn = useCallback(() => {
    onChange(({columns}) => {
      const id = createId()

      return {
        columns: [
          ...columns,
          {
            ...DEFAULT_COLUMN_DATA,
            id,
            entityId,
            order: Object.keys(columns).length,
          }
        ]
      }
    })
  }, [])

  const handleDeleteSelectedColumns = useCallback(() => {
    onChange(({columns}) => {
      return {
        columns: columns.filter((column) => !column.selected)
      }
    })
  }, [])

  const selectedColumns = useMemo(() => {
    return entityData.columns.filter(column => column.selected)
  }, [entityData.columns])

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
