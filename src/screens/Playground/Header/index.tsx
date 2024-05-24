import {ActionIcon, Avatar, Group, Tooltip} from "@mantine/core";
import Title from "./Title";
import PlayerAvatar from "@/screens/Playground/Header/PlayerAvatar/Player.tsx";
import Logo from "@/components/common/Logo.tsx";
import {IconDoorExit} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import Config from "@/screens/Playground/Header/Config";
import {usePlayground} from "@/contexts/playground/PlaygroundStoreContext.ts";

export default function Header() {
  const players = usePlayground(state => state.players)
  const configData = usePlayground(state => ({
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
  }))

  return (
    <Group align={"center"} gap={"5px"} px={"5px"} h={"100%"}>
      <Logo/>
      <Title/>
      <Config data={configData}/>
      <Avatar.Group ml={"auto"}>
        {players.map(player => <PlayerAvatar player={player} key={player.id}/>)}
      </Avatar.Group>
      <Tooltip label={"Exit"}>
        <Link to={"/library"}>
          <ActionIcon size={40} variant={"default"}>
            <IconDoorExit color={"var(--mantine-color-text)"}/>
          </ActionIcon>
        </Link>
      </Tooltip>
    </Group>
  )
}
