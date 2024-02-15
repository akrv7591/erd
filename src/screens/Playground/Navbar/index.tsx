import {Box, SegmentedControl, SegmentedControlItem, SegmentedControlProps, Stack, Tooltip} from "@mantine/core";
import {IconRelationManyToMany, IconRelationOneToMany, IconRelationOneToOne, IconTablePlus} from "@tabler/icons-react";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ITools} from "@/types/table-node";
import React from "react";

interface IData {
  label: string
  value: ITools
  icon: any
  onDragStart?: React.DragEventHandler<HTMLDivElement>
}

const data: IData[] = [
  {
    label: 'Drag and place to add entity',
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

const generateSegmentData = (nodesCount: number): SegmentedControlItem[] => data.map(
  (item) => {
    const disabled = ['one-to-one', 'one-to-many', 'many-to-many',].includes(item.value) && nodesCount < 2
    const isDraggable = DRAWABLES.includes(item.value)
    return {
      disabled,
      value: item.value,
      label: (
        <Tooltip offset={20} label={disabled ? "Need 2 or more tables to have relations" : item.label} position={'right'}>
          <Box {...isDraggable && {draggable: true, onDragStart: item.onDragStart}}
               style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
            <item.icon size={30} stroke={1}/>
          </Box>
        </Tooltip>

      )
    }
  })

export default function Navbar() {
  const nodes = usePlaygroundStore(state => state.tables)
  const tool = usePlaygroundStore(state => state.tool)
  const setTool = usePlaygroundStore(state => state.setTool)
  const data = generateSegmentData(nodes.length)
  const handleChange: SegmentedControlProps['onChange'] = (v) => setTool(v as ITools)

  return (
    <Stack w={"100%"}>
      <SegmentedControl
        data={data}
        value={tool}
        onChange={handleChange}
        orientation={'vertical'}
        fullWidth/>
    </Stack>
  )
}
