import {useNodeId, useReactFlow} from "reactflow";
import {ColorPicker, ColorSwatch, Group, Input, Menu} from "@mantine/core";
import {IconColorPicker, IconTable} from "@tabler/icons-react";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {useDisclosure} from "@mantine/hooks";
import React from "react";
import {Table} from "@/enums/playground.ts";
import {useNodeData} from "@/hooks/useNodeData.ts";

const Header = () => {
  const reactFlow = useReactFlow()
  const id = useNodeId() as string
  const node = reactFlow.getNode(id)
  const data = useNodeData()
  const playground = usePlayground()
  const [opened, {open, close}] = useDisclosure(false)

  React.useEffect(() => {
    if (!node?.selected) {
      close()
    }
  }, [node?.selected])

  if (!node) return null

  return (
    <Group gap={5} h={50} align={"center"}>
      <IconTable color={"var(--mantine-primary-color-filled)"} stroke={1} size={35}/>
      <Input
        value={data.name}
        placeholder={"Table name"}
        autoFocus
        error={!data.name}
        onChange={e => {
          const name = e.target.value
          playground.table(Table.set, {tableId: id, key: "name", value: name})
        }}
      />
      <Menu closeOnClickOutside closeOnEscape opened={opened}>
        <Menu.Target>
          <ColorSwatch color={data.color} ml={"auto"} onClick={opened ? close : open}>
            <IconColorPicker style={{stroke: "2px !important"}} size={15} color={"var(--mantine-color-text)"}/>
          </ColorSwatch>
        </Menu.Target>
        <Menu.Dropdown>
          <ColorPicker
            onChange={color => {
              playground.table(Table.set, {tableId: id, key: "color", value: color})
            }}
            swatchesPerRow={8}
            format="hex"
            swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
        </Menu.Dropdown>
      </Menu>
    </Group>
  )
}


export default Header
