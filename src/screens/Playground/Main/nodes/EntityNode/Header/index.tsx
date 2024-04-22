import {ActionIcon, ColorPicker, ColorPickerProps, Group, HoverCard, Input, Tooltip} from "@mantine/core";
import {IconPalette, IconRowInsertTop, IconTable, IconTrash} from "@tabler/icons-react";
import {ColumnEnum, EntityEnum} from "@/enums/playground.ts";
import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts";
import {ChangeEventHandler, memo} from "react";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {useReactFlow} from "@xyflow/react";
import {EntityNodeColumn} from "@/types/entity-node";
import {DEFAULT_COLUMN_DATA} from "@/constants/erd/column.ts";
import {createId} from "@paralleldrive/cuid2";

const Header = memo(() => {
  const nodeData = useEntityNodeData()
  const playground = usePlaygroundStore(state => state.playground)
  const reactFlow = useReactFlow()

  if (!nodeData) {
    return null
  }

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = e => playground.entity(EntityEnum.patch, {
    entityId: nodeData?.id,
    key: "name",
    value: e.target.value
  })
  const handleColorChange: ColorPickerProps['onChange'] = value => playground.entity(EntityEnum.patch, {
    entityId: nodeData?.id,
    key: "color",
    value
  })
  const handleDelete = () => {
    reactFlow.deleteElements({
      nodes: [{id: nodeData.id}]
    })
  }

  const handleAddColumn = (type: "primary" | "default") => {
    const newColumn: EntityNodeColumn = {
      ...DEFAULT_COLUMN_DATA,
      order: nodeData.data.columns.length,
      entityId: nodeData.id
    }
    newColumn.id = createId()

    if (type === "primary") {
      newColumn.primary = true;
      newColumn.unique = true;
      newColumn.null = true;
    }
    playground.column(ColumnEnum.add, newColumn)
  }

  const handleAddDefaultColumn = () => handleAddColumn("default")

  return (
    <Group gap={5} h={50} align={"center"}>
      <Input
        value={nodeData.data.name}
        placeholder={"Table name"}
        autoFocus
        variant={"filled"}
        size={"sm"}
        leftSection={(
          <IconTable color={"var(--mantine-color-text)"}/>
        )}
        error={!nodeData.data.name}
        onChange={handleNameChange}
      />
      <Tooltip label={"Add row"}>
        <ActionIcon onClick={handleAddDefaultColumn} size={"lg"}>
          <IconRowInsertTop/>
        </ActionIcon>
      </Tooltip>
      <HoverCard>
        <HoverCard.Target>
          <ActionIcon variant={"filled"} size={"lg"} color={nodeData.data.color} ml={"auto"}>
            <IconPalette />
          </ActionIcon>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <ColorPicker
            onChange={handleColorChange}
            swatchesPerRow={8}
            format="hex"
            swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
        </HoverCard.Dropdown>
      </HoverCard>
      <Tooltip label={"Delete entity"}>
        <ActionIcon size={"lg"} onClick={handleDelete}>
          <IconTrash/>
        </ActionIcon>
      </Tooltip>
    </Group>
  )
})


export default Header
