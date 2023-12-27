import {Checkbox, Collapse, Table, Text} from "@mantine/core";
import React from "react";
import {useNodeData} from "@/hooks/useNodeData.ts";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {Column} from "@/enums/playground.ts";

const RenderList = React.memo(React.forwardRef<any, any>((props, ref) => {
  const data = useNodeData()
  const playground = usePlayground()
  const checkbox = React.useMemo(() => {
    const selected = data.columns.filter(c => c.selected)
    const isAllChecked = selected.length === data.columns.length
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
    <Table withRowBorders>
      <Table.Caption>
        <Collapse in={data.columns.length === 0}>
          <Text>No columns</Text>
        </Collapse>
      </Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Td w={40}></Table.Td>
          <Table.Td w={40}>
            <Checkbox indeterminate={checkbox.isIntermediate} onChange={onCheckboxChange} checked={checkbox.isAllChecked}/>
          </Table.Td>
          <Table.Td w={40}></Table.Td>
          <Table.Td maw={200} miw={200}>Column</Table.Td>
          <Table.Td maw={150} miw={150} width={150}>Data type</Table.Td>
          <Table.Td miw={40}>PK</Table.Td>
          <Table.Td miw={40}>NN</Table.Td>
          <Table.Td miw={40}>UQ</Table.Td>
          <Table.Td miw={40}>UN</Table.Td>
          <Table.Td miw={40}>AI</Table.Td>
          <Table.Td miw={200}>Comment</Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody ref={ref}>
        {props.children}
      </Table.Tbody>
    </Table>
  )
}))


export default RenderList
