import {useNodeId, useReactFlow} from "@xyflow/react";
import {ColorPicker, ColorSwatch, Group, HoverCard, Input} from "@mantine/core";
import {IconPalette, IconTable} from "@tabler/icons-react";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {Table} from "@/enums/playground.ts";
import {useNodeData} from "@/hooks/useNodeData.ts";

const Header = () => {
  const reactFlow = useReactFlow()
  const id = useNodeId() as string
  const node = reactFlow.getNode(id)
  const data = useNodeData()
  const playground = usePlayground()

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
      <HoverCard>
        <HoverCard.Target>
          <ColorSwatch color={data.color} ml={"auto"}>
            <IconPalette size={25} color={"var(--mantine-primary-color-0)"}/>
          </ColorSwatch>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <ColorPicker
            onChange={color => {
              playground.table(Table.set, {tableId: id, key: "color", value: color})
            }}
            swatchesPerRow={8}
            format="hex"
            swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  )
}


export default Header
