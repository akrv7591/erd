import React from "react";
import {useNodeId, useReactFlow} from "reactflow";
import {ActionIcon, ColorPicker, ColorSwatch, Group, Menu, TextInput, Tooltip} from "@mantine/core";
import {IconCheck, IconColorPicker, IconEdit, IconTable} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import {useErdTableData} from "../../../../../providers/ErdTableDataProvider";

const Header = () => {
  const [allowEdit, setAllowEdit] = React.useState(false)
  const reactFlow = useReactFlow()
  const id = useNodeId() as string
  const node = reactFlow.getNode(id)
  const toggleAllowEdit = () => setAllowEdit(cur => !cur)
  const form = useForm()
  const {data, setData} = useErdTableData()
  if (!node) return null

  return (
    <Group gap={5} h={50} align={"center"}>
      <IconTable stroke={1} size={35}/>
      <form onSubmit={form.onSubmit(toggleAllowEdit)}>
        <TextInput
          key={String(allowEdit)}
          disabled={!allowEdit}
          defaultValue={data.name}
          placeholder={"Table name"}
          autoFocus
          rightSection={<Tooltip label={"Save"}>
            <ActionIcon onClick={toggleAllowEdit}>
              {allowEdit ? <IconCheck stroke={1} size={20}/> : <IconEdit stroke={1} size={20}/>}
            </ActionIcon>
          </Tooltip>}
          error={!data.name}
          onChange={e => setData((cur) => ({
            ...cur,
            name: e.target.value
          }))}
        />
      </form>
      <Menu closeOnClickOutside closeOnEscape>
        <Menu.Target>
          <ColorSwatch color={data.color} ml={"auto"}>
            <IconColorPicker stroke={1} size={15}/>
          </ColorSwatch>
        </Menu.Target>
        <Menu.Dropdown>
          <ColorPicker
            onChange={color => setData(cur => ({...cur, color}))}
            swatchesPerRow={8}
            format="hex"
            swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}


export default Header
