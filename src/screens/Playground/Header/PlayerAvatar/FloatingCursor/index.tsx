import {IconPointerFilled} from "@tabler/icons-react";
import {Box, Text} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import classes from "./style.module.css"
import {memo} from "react";
import {Player} from "@/types/playground";
import {IUser} from "@/types/data/db-model-interfaces";

type Data = Player & Omit<IUser, 'id'>

interface Props {
  data: Data
}

const FloatingCursor = memo((props: Props) => {
  const reactflow = useReactFlow()

  if (!props.data.cursorPosition) return null

  const position = reactflow.flowToScreenPosition(props.data.cursorPosition)
  return (
    <Box top={position.y - 5} left={position.x - 5} className={classes.wrapper}>
      <IconPointerFilled size={20} color={"var(--mantine-color-text)"} fill={"var(--mantine-color-dark-6)"}/>
      <div className={classes.label}>
        <Text size={"xs"}>{props.data.name}</Text>
      </div>
    </Box>
  )
})

export default FloatingCursor

