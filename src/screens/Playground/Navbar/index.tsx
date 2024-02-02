import {ActionIcon, Box, SegmentedControl, SegmentedControlItem, Stack, Tooltip} from "@mantine/core";
import {
  IconHandGrab,
  IconRelationManyToMany,
  IconRelationOneToMany,
  IconRelationOneToOne,
  IconTablePlus
} from "@tabler/icons-react";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {ITools} from "@/types/table-node";
import React from "react";


const data: {
  label: string
  value: ITools
  icon: any
}[] = [
  {
    label: 'Grab',
    value: 'grab',
    icon: IconHandGrab
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

const generateSegmentData = (nodesCount: number): SegmentedControlItem[] => data.map(({label, icon: Icon, value}) => {
  const disabled = ['one-to-one', 'one-to-many', 'many-to-many',].includes(value) && nodesCount < 2
  return {
    disabled,
    value: value,
    label: (
      <Tooltip label={disabled ? "Need 2 or more tables to have relations" : label} position={'right'}>
        <Box style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
          <Icon size={30} stroke={1}/>
        </Box>
      </Tooltip>

    )
  }
})

export default function Navbar() {
  const [nodes, tool, setTool] = usePlaygroundStore(state => ([state.tables, state.tool, state.setTool]))
  const data = generateSegmentData(nodes.length)
  const onDragStart: React.DragEventHandler<HTMLButtonElement> = (event) => {
    event.dataTransfer.setData('application/reactflow', "tableNode");
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Stack w={"100%"}>
      <SegmentedControl
        // variant={"default"}
        // color={"var(--mantine-color-blue-light)"}
        data={data}
        value={tool}
        onChange={(v) => {
          setTool(v as ITools)
        }}
        orientation={'vertical'}
        fullWidth/>
      <Tooltip label={"Drag and drop to add a table"}>
        <ActionIcon
          variant={"default"}
          w={"40px"}
          h={"40px"}
          mx={"auto"}
          mt={"5px"}
          draggable
          onDragStart={onDragStart}
          style={{border: "none"}}
        >
          <IconTablePlus size={20}/>
        </ActionIcon>
      </Tooltip>
    </Stack>
  )
}
