import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import {IconPointer} from "@tabler/icons-react";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {Box, Text} from "@mantine/core";
import {useReactFlow} from "@xyflow/react";
import classes from "./style.module.css"

export default function PlayerCursor() {
  const players = usePlaygroundStore(state => state.players)
  const authorizedUser = useAuthStore(state => state.getAuthorization())
  const reactflow = useReactFlow()

  return players.filter(player => player.id !== authorizedUser?.id && player.cursorPosition).map(player => {
    const position = reactflow.flowToScreenPosition(player.cursorPosition)

    return (
      <Box top={position.y} left={position.x} key={player.id} className={classes.wrapper}>
        <IconPointer />
        <div className={classes.label}>
          <Text size={"xs"}>{player.name}</Text>
        </div>
      </Box>
    )
  })
}
