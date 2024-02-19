import {Checkbox, Collapse, Table as MantineTable, Text} from "@mantine/core";
import React from "react";
import {useNodeData} from "@/hooks/useNodeData.ts";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {Column} from "@/enums/playground.ts";

const Table = React.memo(React.forwardRef<any, any>((props, ref) => {
  const data = useNodeData()
  const playground = usePlayground()
  const checkbox = React.useMemo(() => {
    const selected = data.columns.filter(c => c.selected)
    const isAllChecked  = data.columns.length > 0 && selected.length === data.columns.length
    const isIntermediate = selected.length > 0 && !isAllChecked

    return {
      isAllChecked,
      isIntermediate,
      selected
    }
  }, [data.columns])

  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback((e) => {
    if (checkbox.isIntermediate) {
      checkbox.selected.forEach(column => playground.column(Column.update, {...column, selected: false}))
    } else if (e.target.checked) {
      data.columns.forEach(column => playground.column(Column.update, {...column, selected: true}))
    } else {
      data.columns.forEach(column => playground.column(Column.update, {...column, selected: false}))
    }
  }, [data.columns])

  return (
    <MantineTable withRowBorders>
      <MantineTable.Caption>
        <Collapse in={data.columns.length === 0}>
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
}))


export default Table
