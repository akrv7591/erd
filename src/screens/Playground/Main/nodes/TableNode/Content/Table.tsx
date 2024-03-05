import {Checkbox, Collapse, Table as MantineTable, Text} from "@mantine/core";
import React from "react";
import {useNodeData} from "@/hooks/useNodeData.ts";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {Column} from "@/enums/playground.ts";

const Table = React.forwardRef<any, any>((props, ref) => {
  const nodeData = useNodeData()
  const playground = usePlayground()
  const checkbox = React.useMemo(() => {
    if (!nodeData) {
      return {
        isAllChecked: false,
        isIntermediate: false,
        selected: []
      }
    }
    const {columns} = nodeData.data
    const selected = columns.filter(c => c.selected)
    const isAllChecked  = columns.length > 0 && selected.length === columns.length
    const isIntermediate = selected.length > 0 && !isAllChecked

    return {
      isAllChecked,
      isIntermediate,
      selected
    }
  }, [nodeData])

  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
    if (!nodeData) {
      return
    }

    const { columns } = nodeData.data
    if (checkbox.isIntermediate) {
      checkbox.selected.forEach(column => playground.column(Column.update, {...column, selected: false}))
    } else if (e.target.checked) {
      columns.forEach(column => playground.column(Column.update, {...column, selected: true}))
    } else {
      columns.forEach(column => playground.column(Column.update, {...column, selected: false}))
    }
  }, [nodeData])

  if (!nodeData) {
    return null
  }

  return (
    <MantineTable withRowBorders>
      <MantineTable.Caption>
        <Collapse in={nodeData.data.columns.length === 0}>
          <Text>No columns</Text>
        </Collapse>
      </MantineTable.Caption>
      <MantineTable.Thead>
        <MantineTable.Tr>
          <MantineTable.Td w={40}></MantineTable.Td>
          <MantineTable.Td w={40}>
            <Checkbox indeterminate={checkbox.isIntermediate} onChange={onCheckboxChange} checked={checkbox.isAllChecked}/>
          </MantineTable.Td>
          <MantineTable.Td w={40}></MantineTable.Td>
          <MantineTable.Td maw={200} miw={200}>Column</MantineTable.Td>
          <MantineTable.Td maw={150} miw={150} width={150}>Data type</MantineTable.Td>
          <MantineTable.Td miw={40}>PK</MantineTable.Td>
          <MantineTable.Td miw={40}>NN</MantineTable.Td>
          <MantineTable.Td miw={40}>UQ</MantineTable.Td>
          <MantineTable.Td miw={40}>UN</MantineTable.Td>
          <MantineTable.Td miw={40}>AI</MantineTable.Td>
          <MantineTable.Td miw={200}>Comment</MantineTable.Td>
        </MantineTable.Tr>
      </MantineTable.Thead>
      <MantineTable.Tbody ref={ref}>
        {props.children}
      </MantineTable.Tbody>
    </MantineTable>
  )
})


export default Table
