import {useErdDiagramStore} from "@/stores/useErdDiagramStore.ts";
import {IconPointer} from "@tabler/icons-react";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {Box, Text} from "@mantine/core";
import {useReactFlow} from "reactflow";

export default function PlayerCursor() {
  const players = useErdDiagramStore(state => state.players)
  const authorizedUser = useAuthStore(state => state.getAuthorization())
  const reactflow = useReactFlow()

  return players.filter(player => player.id !== authorizedUser?.id && player.cursorPosition).map(player => {
    const position = reactflow.flowToScreenPosition(player.cursorPosition)

    return (
      <Box style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 1000
      }}
      >
        <IconPointer key={player.id}/>
        <Text ml={30} style={{
          borderRadius: "5px",
          padding: "5px 10px",
          backgroundColor: "var(--mantine-color-dark-5)"
        }}>{player.name}</Text>
      </Box>
    )
  })
}
