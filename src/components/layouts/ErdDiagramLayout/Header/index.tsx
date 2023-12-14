import {AvatarGroup, Group} from "@mantine/core";
import Logo from "./Logo";
import Title from "./Title";
import {useErdDiagramStore} from "../../../../stores/useErdDiagramStore.ts";
import Player from "./Player/Player.tsx";

export default function Header() {
  const players = useErdDiagramStore(state => state.players)
  return (
    <Group align={"center"} px={"10px"} h={"100%"}>
      <Logo/>
      <Title />
      <AvatarGroup ml={"auto"}>
        {players.map(player => <Player player={player} key={player.id} />)}
      </AvatarGroup>
    </Group>
  )
}
