import {Box, SegmentedControl, SegmentedControlItem, Stack, Tooltip} from "@mantine/core";
import {
  IconHandGrab,
  IconRelationManyToMany,
  IconRelationOneToMany,
  IconRelationOneToOne,
  IconSelectAll,
  IconTablePlus
} from "@tabler/icons-react";
import {useAtom, useAtomValue} from 'jotai'
import {ITools, toolAtom} from "../../../../atoms/toolAtom";
import React from "react";
import {nodesAtom} from "../../../../atoms/nodesAtoms";


const data: {
  label: string
  value: ITools
  icon: any
}[] = [
  {
    label: 'Grab',
    value: 'grab',
    icon: IconHandGrab
  },
  {
    label: 'Add table',
    value: 'add-table',
    icon: IconTablePlus
  }, {
    label: 'Select multiple',
    value: 'select-all',
    icon: IconSelectAll
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
  const disabled = ['one-to-one', 'one-to-many', 'many-to-many',].includes(value) && nodesCount  < 2
  return {
    disabled,
    value: value,
    label: (
      <Tooltip label={disabled? "Need 2 or more tables to have relations": label} position={'right'}>
        <Box style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
          <Icon size={30} stroke={1}/>
        </Box>
      </Tooltip>

    )
  }
})

export default function Navbar() {
  const [tool, setTool] = useAtom(toolAtom)
  const nodes = useAtomValue(nodesAtom)

  const data = generateSegmentData(nodes.length)

  return (
    <Stack w={"100%"}>
      <SegmentedControl
        data={data}
        value={tool}
        onChange={(v: ITools) => {
          setTool(v)
        }}
        orientation={'vertical'}
        fullWidth/>
    </Stack>
  )
}
