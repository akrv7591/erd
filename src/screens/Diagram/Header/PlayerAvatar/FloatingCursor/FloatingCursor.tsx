import {IconPointer} from "@tabler/icons-react";
import {Box, Text} from "@mantine/core";
import classes from "./style.module.css"
import {memo} from "react";

interface Props {
  x: number
  y: number
  name: string
  color: string
}

export const FloatingCursor = memo((props: Props) => {
  return (
    <Box
      top={props.y - 5}
      left={props.x - 5}
      className={classes.wrapper}
    >
      <IconPointer size={20} color={"#fff"}/>
      <div className={classes.label} style={{borderColor: props.color}}>
        <Text size={"xs"}>{props.name}</Text>
      </div>
    </Box>
  )
})
