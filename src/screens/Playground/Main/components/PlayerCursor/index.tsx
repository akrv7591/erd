import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {IconPointerFilled} from "@tabler/icons-react";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {Box, Text} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import classes from "./style.module.css"

export default function PlayerCursor() {
  const players = usePlaygroundStore(state => state.players)
  const user = useAuthStore(state => state.user)
  const reactflow = useReactFlow()

  return players.filter(player => player?.id !== user?.id && player.cursorPosition).map(player => {

    if (!player?.id) return null

    const position = reactflow.flowToScreenPosition(player.cursorPosition)
    return (
      <Box top={position.y - 5} left={position.x - 5} key={player.id} className={classes.wrapper}>
        <IconPointerFilled size={20} color={"var(--mantine-color-text)"} fill={"var(--mantine-color-dark-6)"}/>
        <div className={classes.label}>
          <Text size={"xs"}>{player.name}</Text>
        </div>
      </Box>
    )
  })
}
