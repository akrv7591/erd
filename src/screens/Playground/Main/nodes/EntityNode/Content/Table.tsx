import {Checkbox, Collapse, Table as MantineTable, Text, Tooltip} from "@mantine/core";
import React from "react";
import {useEntityData} from "@/hooks/useEntityData.ts";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {EntityViewMode} from "@/enums/playground.ts";

const Table = React.forwardRef<any, any>((props, ref) => {
  console.log("RENDERING CONTENT TABLE")
  const [nodeData, setNodeData] = useEntityData()
  const viewMode = usePlaygroundStore(state => state.mode)
  const checkbox = React.useMemo(() => {
    if (!nodeData) {
      return {
        isAllChecked: false,
        isIntermediate: false,
        selected: []
      }
    }

    const {columns} = nodeData
    const selected = columns.filter(c => c.selected)
    const isAllChecked = columns.length > 0 && selected.length === columns.length
    const isIntermediate = selected.length > 0 && !isAllChecked

    return {
      isAllChecked,
      isIntermediate,
      selected
    }
  }, [nodeData])

  const onCheckboxClick = React.useCallback(() => {
    const selected = !checkbox.isIntermediate && !checkbox.isAllChecked
    setNodeData(cur => ({...cur, columns: cur.columns.map(column => ({...column, selected}))}))

  }, [checkbox])

  if (!nodeData) {
    return null
  }


  const renderContent = viewMode === EntityViewMode.EDITOR
    ? (
      <MantineTable.Tr>
        <MantineTable.Td w={40}></MantineTable.Td>
        <MantineTable.Td w={40}>
          {/*TODO implement select all*/}
          <Checkbox
            indeterminate={checkbox.isIntermediate}
            checked={checkbox.isAllChecked}
            onChange={() => {}}
            onClick={onCheckboxClick}
          />
        </MantineTable.Td>
        <MantineTable.Td w={40}></MantineTable.Td>
        <MantineTable.Td maw={200} miw={200}>Column</MantineTable.Td>
        <MantineTable.Td maw={150} miw={150} width={150}>Data type</MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Primary Key"}><Text>PK</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Not Null"}><Text>NN</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Unique"}><Text>UQ</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Unsigned"}><Text>UN</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Auto Increment"}><Text>AI</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={200}>Comment</MantineTable.Td>
      </MantineTable.Tr>
    )
    : (<MantineTable.Tr>
      <MantineTable.Td w={40}></MantineTable.Td>
      <MantineTable.Td maw={200} miw={200}>Column</MantineTable.Td>
      <MantineTable.Td maw={150} miw={150} width={150}>Data type</MantineTable.Td>
    </MantineTable.Tr>)


  return (
    <MantineTable withRowBorders>
      <MantineTable.Caption>
        <Collapse in={nodeData.columns.length === 0}>
          <Text>No columns</Text>
        </Collapse>
      </MantineTable.Caption>
      <MantineTable.Thead>
        {renderContent}
      </MantineTable.Thead>
      <MantineTable.Tbody ref={ref}>
        {props.children}
      </MantineTable.Tbody>
    </MantineTable>
  )
})


export default Table
