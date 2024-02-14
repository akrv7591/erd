import {ActionIcon, Avatar, Group, Tooltip} from "@mantine/core";
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
    <Group align={"center"} px={"10px"} h={"100%"}>
      <Logo />
      <Title/>
      <Avatar.Group ml={"auto"}>
        {players.map(player => <PlayerAvatar player={player} key={player.id}/>)}
      </Avatar.Group>
      <Account/>
      <Tooltip label={"Exit"}>
        <Link to={"/library"}>
          <ActionIcon size={"30px"} variant={"default"}>
            <IconDoorExit />
          </ActionIcon>
        </Link>
      </Tooltip>
    </Group>
  )
}
