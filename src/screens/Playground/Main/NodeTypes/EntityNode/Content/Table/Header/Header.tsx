import {Checkbox, Collapse, Table as MantineTable, Text, Tooltip} from "@mantine/core";
import React from "react";
import {EntityViewMode} from "@/enums/playground.ts";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import {useDiagramStore} from "@/contexts/DiagramContext";

export const Header = React.forwardRef<any, any>((props, ref) => {
  const {data: nodeData, setData: setNodeData, columns} = useEntityNodeData()
  const viewMode = useDiagramStore(state => state.entityViewMode)

  const checkbox = React.useMemo(() => {
    if (!nodeData) {
      return {
        isAllChecked: false,
        isIntermediate: false,
        selected: []
      }
    }

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
    setNodeData(state => {
      return {
        ...state,
          columns: Object.fromEntries(columns.map(column => [column.id, { ...column, selected }]))
      }
    })

  }, [checkbox, setNodeData])


  const renderContent = viewMode === EntityViewMode.EDITOR
    ? (
      <MantineTable.Tr>
        <MantineTable.Td w={40}></MantineTable.Td>
        <MantineTable.Td w={40}>
          <Checkbox
            indeterminate={checkbox.isIntermediate}
            checked={checkbox.isAllChecked}
            onChange={() => {}}
            onClick={onCheckboxClick}
          />
        </MantineTable.Td>
        <MantineTable.Td w={40}></MantineTable.Td>
        <MantineTable.Td>Column</MantineTable.Td>
        <MantineTable.Td w={150}>Data type</MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Primary key"}><Text>PK</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"NOT NULL"}><Text>NN</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Unique"}><Text>UQ</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Unsigned"}><Text>UN</Text></Tooltip></MantineTable.Td>
        <MantineTable.Td miw={40}><Tooltip position={"top"} label={"Auto increment"}><Text>AI</Text></Tooltip></MantineTable.Td>
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
        <Collapse in={columns.length === 0}>
          <Text>No rows</Text>
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
