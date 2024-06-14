// Library imports
import {Avatar, Group} from "@mantine/core";

// Hooks
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";
import {useShallow} from "zustand/react/shallow";

// Components
import Logo from "@/components/common/Logo.tsx";
import {Title} from "./Title";
import {Config} from "./Config";
import {PlayerAvatar} from "./PlayerAvatar";
import {ExitButton} from "./ExitButton";

import type {PlaygroundStore} from "@/stores/playgroundStore.ts";

const selector = (state: PlaygroundStore) => ({
  players: state.players,
  erdData: {
    id: state.id,
    createdAt: state.createdAt,
    updatedAt: state.updatedAt,
    name: state.name,
    description: state.description,
    isPublic: state.isPublic,
    teamId: state.teamId,
    tableNameCase: state.tableNameCase,
    columnNameCase: state.columnNameCase,
    connected: state.connected
  }
})

export const Header = () => {
  const {players, erdData} = usePlayground(useShallow(selector))
  return (
    <Group align={"center"} gap={"5px"} px={"5px"} h={"100%"}>
      <Logo/>
      <Title/>
      <Config data={erdData}/>
      <Avatar.Group ml={"auto"}>
        {players.map(player => <PlayerAvatar player={player} key={player.id}/>)}
      </Avatar.Group>
      <ExitButton/>
    </Group>
  )
}
