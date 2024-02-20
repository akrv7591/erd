import {ActionIcon, Group, Tooltip} from "@mantine/core";
import Title from "./Title";
import {usePlaygroundStore} from "@/stores/usePlaygroundStore.ts";
import PlayerAvatar from "@/screens/Playground/Header/PlayerAvatar/Player.tsx";
import Logo from "@/components/common/Logo.tsx";
import Account from "@/components/common/Account";
import {IconDoorExit} from "@tabler/icons-react";
import {Link} from "react-router-dom";

export default function Header() {
  const players = usePlaygroundStore(state => state.players)

  return (
    <Group align={"center"} gap={"5px"} px={"5px"} h={"100%"}>
      <Logo/>
      <Title/>
      <Group ml={"auto"} gap={0}>
        {players.map(player => <PlayerAvatar player={player} key={player.id}/>)}
      </Group>
      <Tooltip label={"Exit"}>
        <Link to={"/library"}>
          <ActionIcon variant={"default"} size={"lg"}>
            <IconDoorExit size={18} color={"var(--mantine-color-text)"}/>
          </ActionIcon>
        </Link>
      </Tooltip>
      <Account/>
    </Group>
  )
}
