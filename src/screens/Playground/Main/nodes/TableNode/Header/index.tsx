import {ColorPicker, ColorPickerProps, ColorSwatch, Group, HoverCard, Input} from "@mantine/core";
import {IconPalette, IconTable} from "@tabler/icons-react";
import {usePlayground} from "@/contexts/PlaygroundContext.ts";
import {Table} from "@/enums/playground.ts";
import {useNodeData} from "@/hooks/useNodeData.ts";
import {ChangeEventHandler} from "react";

const Header = () => {
  const nodeData = useNodeData()
  const playground = usePlayground()

  if (!nodeData) {
    return null
  }

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = e => playground.table(Table.set, {
    tableId: nodeData?.id,
    key: "name",
    value: e.target.value
  })
  const handleColorChange: ColorPickerProps['onChange'] = value => playground.table(Table.set, {
    tableId: nodeData?.id,
    key: "color",
    value
  })

  return (
    <Group gap={5} h={50} align={"center"}>
      <Input
        value={nodeData.data.name}
        placeholder={"Table name"}
        autoFocus
        variant={"filled"}
        size={"sm"}
        leftSection={(
          <IconTable color={"var(--mantine-primary-color-filled)"}/>
        )}
        error={!nodeData.data.name}
        onChange={handleNameChange}
      />
      <HoverCard>
        <HoverCard.Target>
          <ColorSwatch color={nodeData.data.color} ml={"auto"}>
            <IconPalette size={25} color={"var(--mantine-primary-color-0)"}/>
          </ColorSwatch>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <ColorPicker
            onChange={handleColorChange}
            swatchesPerRow={8}
            format="hex"
            swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
        </HoverCard.Dropdown>
      </HoverCard>
    </Group>
  )
}


export default Header
