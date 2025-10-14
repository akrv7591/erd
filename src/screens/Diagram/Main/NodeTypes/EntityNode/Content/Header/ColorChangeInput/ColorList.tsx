import { FC, memo } from "react";
import { ActionIcon, ColorSwatch, SimpleGrid } from "@mantine/core";
import classes from "./style.module.css"
import { DIAGRAM } from "@/namespaces";
import { useUpdateEntityColor } from "@/hooks/useEntityData";

interface ColorBtnProps {
  color: string
  onColorChange: (color: string) => void
}

const ColorBtn: FC<ColorBtnProps> = memo(({ color, onColorChange }) => {
  const handleColorClick = () => {
    onColorChange(color)
  }

  return (
    <ActionIcon
      variant={"default"}
      onClick={handleColorClick}
    >
      <ColorSwatch
        size={20}
        radius={"xs"}
        className={classes.color}
        color={color}
      />
    </ActionIcon>
  )
})

export const ColorList = memo(() => {
  const handleColorChange = useUpdateEntityColor()

  return (
    <SimpleGrid spacing={"5px"} cols={5} className={classes.root} p={0}>
      {DIAGRAM.ENTITY.COLORS.map(color => (
        <ColorBtn key={color} color={color} onColorChange={handleColorChange}/>
      ))}
    </SimpleGrid>
  )
})
