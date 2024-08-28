import {useEntityNodeData} from "@/hooks/useEntityNodeData.ts"
import {ActionIcon, ColorPicker, ColorPickerProps, HoverCard} from "@mantine/core"
import {IconPalette} from "@tabler/icons-react"
import {memo} from "react"

export const ColorChangeInput = memo(() => {
  const {data, setData} = useEntityNodeData()

  const handleColorChange: ColorPickerProps['onChange'] = color => {
    setData({color})
  }

  return (
    <HoverCard closeDelay={50} withinPortal={false}>
      <HoverCard.Target>
        <ActionIcon variant={"subtle"} size={"lg"} ml={"auto"} color={'var(--mantine-primary-color-filled)'}>
          <IconPalette/>
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
