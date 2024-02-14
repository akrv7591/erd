import {Box, SegmentedControl, SegmentedControlItem, Stack, Tooltip} from "@mantine/core";
import {IconRelationManyToMany, IconRelationOneToMany, IconRelationOneToOne, IconTablePlus} from "@tabler/icons-react";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ITools} from "@/types/table-node";
import React from "react";


const data: {
  label: string
  value: ITools
  icon: any
  onDragStart?: React.DragEventHandler<HTMLDivElement>
}[] = [
  {
    label: 'Add table',
    value: 'add-table',
    icon: IconTablePlus,
    onDragStart: (event) => {
      event.dataTransfer.setData('application/reactflow', "tableNode");
      event.dataTransfer.effectAllowed = 'move';
    }
  }, {
    label: 'One to one',
    value: 'one-to-one',
    icon: IconRelationOneToOne
  }, {
    label: 'One to many',
    value: 'one-to-many',
    icon: IconRelationOneToMany
  }, {
    label: 'Many to many',
    value: 'many-to-many',
    icon: IconRelationManyToMany
  }]

const DRAWABLES = ['add-table']

const generateSegmentData = (nodesCount: number): SegmentedControlItem[] => data.map(({
                                                                                        label,
                                                                                        icon: Icon,
                                                                                        value,
                                                                                        onDragStart
                                                                                      }) => {
  const disabled = ['one-to-one', 'one-to-many', 'many-to-many',].includes(value) && nodesCount < 2
  const isDraggable = DRAWABLES.includes(value)
  return {
    disabled,
    value: value,
    label: (
      <Tooltip label={disabled ? "Need 2 or more tables to have relations" : label} position={'right'}>
        <Box {...isDraggable && {draggable: true, onDragStart}}
             style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
          <Icon size={30} stroke={1}/>
        </Box>
      </Tooltip>

    )
  }
})

export default function Navbar() {
  const [nodes, tool, setTool] = usePlaygroundStore(state => ([state.tables, state.tool, state.setTool]))
  const data = generateSegmentData(nodes.length)

  return (
    <Stack w={"100%"}>
      <SegmentedControl
        data={data}
        value={tool}
        onChange={(v) => {
          setTool(v as ITools)
        }}
        orientation={'vertical'}
        fullWidth/>
    </Stack>
  )
}
