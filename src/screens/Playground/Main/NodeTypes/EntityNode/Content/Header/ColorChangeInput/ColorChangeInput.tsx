import { usePlayground } from "@/contexts/playground/PlaygroundStoreContext.ts"
import { EntityEnum } from "@/enums/playground.ts"
import { useEntityNodeData } from "@/hooks/useEntityNodeData.ts"
import { PlaygroundStore } from "@/stores/playgroundStore.ts"
import { ActionIcon, ColorPicker, ColorPickerProps, HoverCard } from "@mantine/core"
import { IconPalette } from "@tabler/icons-react"
import { memo } from "react"
import { useShallow } from "zustand/react/shallow"

const getSelectors = ({playground, patchEntityData}: PlaygroundStore) => ({playground, patchEntityData})

export const ColorChangeInput = memo(() => {
  const {data, id} = useEntityNodeData()
  const {playground, patchEntityData} = usePlayground(useShallow(getSelectors))

  const handleColorChange: ColorPickerProps['onChange'] = value => {
    const data = {
      entityId: id,
      key: "color",
      value
    }
    const entityPatchResponse = playground.handleEmitResponse({
      onError: playground.notifyErrorMessage(EntityEnum.patch, "Failed to patch entity(color)"),
      onSuccess: () => {
        patchEntityData(data)
      }
    })

    playground.socket.emit(EntityEnum.patch, data, entityPatchResponse)
  }

  return (
    <HoverCard>
      <HoverCard.Target>
        <ActionIcon variant={"subtle"} size={"lg"} ml={"auto"} color={'var(--mantine-primary-color-filled)'}>
          <IconPalette />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <ColorPicker
          value={data.color}
          onChange={handleColorChange}
          swatchesPerRow={8}
          format="hex"
          swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}/>
      </HoverCard.Dropdown>
    </HoverCard>
  )
})
