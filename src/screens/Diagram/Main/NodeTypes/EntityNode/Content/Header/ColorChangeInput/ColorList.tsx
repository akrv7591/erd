import {memo, useCallback} from "react";
import {ActionIcon, ColorSwatch, SimpleGrid} from "@mantine/core";
import classes from "./style.module.css"
import {useEntityNode} from "@/hooks";
import {DIAGRAM} from "@/namespaces";

export const ColorList = memo(() => {
  const {onChange} = useEntityNode()
  const handleColorClick = useCallback((color: string) => () => {
    onChange({color})
  }, [onChange])

  return (
    <SimpleGrid spacing={"5px"} cols={5} className={classes.root}>
      {DIAGRAM.ENTITY.COLORS.map(color => (
        <ActionIcon key={color} variant={"default"} >
          <ColorSwatch
            size={20}
            radius={"xs"}
            className={classes.color}
            onClick={handleColorClick(color)}
            color={color}
          />
        </ActionIcon>
      ))}
    </SimpleGrid>
  )
})
