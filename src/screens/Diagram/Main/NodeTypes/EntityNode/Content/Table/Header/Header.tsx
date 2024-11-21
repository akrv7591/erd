import {Checkbox, Table as MantineTable, Text, Tooltip} from "@mantine/core";
import React from "react";
import {useDiagramStore, useEntityColumns} from "@/hooks";
import {useEntityNode} from "@/hooks";
import {DIAGRAM} from "@/namespaces";
import { NODE } from "@/namespaces/broadcast/node";

export const Header = React.forwardRef<any, any>((props, ref) => {
  const {data: nodeData} = useEntityNode()
  const viewMode = useDiagramStore(state => state.entityViewMode)
  const {updateColumn} = useEntityColumns()
  const checkbox = React.useMemo(() => {
    if (!nodeData) {
      return {
        isAllChecked: false,
        isIntermediate: false,
        selected: []
      }
    }

    const selected = nodeData.columns.filter(c => c.selected)
    const isAllChecked = nodeData.columns.length > 0 && selected.length === nodeData.columns.length
    const isIntermediate = selected.length > 0 && !isAllChecked

    return {
      isAllChecked,
      isIntermediate,
      selected
    }
  }, [nodeData])

  const onCheckboxClick = React.useCallback(() => {
    const selected = !checkbox.isIntermediate && !checkbox.isAllChecked
    const currentChanges: NODE.ENTITY.COLUMN_UPDATE['value']['changes']  = nodeData.columns.map(column => ({
      id: column.id,
      key: "selected",
      value: column.selected
    }))

    const updatedChanges: NODE.ENTITY.COLUMN_UPDATE['value']['changes'] = nodeData.columns.map(column => ({
      id: column.id,
      key: "selected",
      value: selected
    }))

    updateColumn(currentChanges, updatedChanges)

  }, [checkbox, nodeData.columns])


  const renderContent = viewMode === DIAGRAM.ENTITY.VIEW_MODE.EDITOR
    ? (
      <MantineTable.Tr>
        <MantineTable.Td w={40}></MantineTable.Td>
        <MantineTable.Td w={40}>
          <Checkbox
            indeterminate={checkbox.isIntermediate}
            checked={checkbox.isAllChecked}
            onChange={onCheckboxClick}
          />
        </MantineTable.Td>
        <MantineTable.Td w={40}></MantineTable.Td>
        <MantineTable.Td miw={150}>Column</MantineTable.Td>
        <MantineTable.Td miw={150}>Data type</MantineTable.Td>
        <MantineTable.Td miw={40}>
          <Tooltip position={"top"} label={"Primary key"}>
            <Text>PK</Text>
          </Tooltip>
        </MantineTable.Td>
        <MantineTable.Td miw={40}>
          <Tooltip position={"top"} label={"NOT NULL"}>
            <Text>NN</Text>
          </Tooltip>
        </MantineTable.Td>
        <MantineTable.Td miw={40}>
          <Tooltip position={"top"} label={"Unique"}>
            <Text>UQ</Text>
          </Tooltip>
        </MantineTable.Td>
        <MantineTable.Td miw={40}>
          <Tooltip position={"top"} label={"Unsigned"}>
            <Text>UN</Text>
          </Tooltip>
        </MantineTable.Td>
        <MantineTable.Td miw={40}>
          <Tooltip position={"top"} label={"Auto increment"}>
            <Text>AI</Text>
          </Tooltip>
        </MantineTable.Td>
        <MantineTable.Td miw={200}>
          <Text>Comment</Text>
        </MantineTable.Td>
      </MantineTable.Tr>
    ) : (
      <MantineTable.Tr>
        <MantineTable.Td w={40}></MantineTable.Td>
        <MantineTable.Td maw={200} miw={200}>Column</MantineTable.Td>
        <MantineTable.Td maw={150} miw={150} width={150}>Data type</MantineTable.Td>
      </MantineTable.Tr>
    )


  return (
    <MantineTable withRowBorders w={viewMode === DIAGRAM.ENTITY.VIEW_MODE.EDITOR? 750: 350}>
      {nodeData.columns.length === 0 && (
        <MantineTable.Caption>
          <Text>No rows</Text>
        </MantineTable.Caption>
      )}
      <MantineTable.Thead>
        {renderContent}
      </MantineTable.Thead>
      <MantineTable.Tbody ref={ref}>
        {props.children}
      </MantineTable.Tbody>
    </MantineTable>
  )
})
