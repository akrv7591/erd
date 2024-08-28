import {Avatar, Group} from "@mantine/core";
import {useSharedDiagramStore} from "@/contexts/SharedDiagramContext.ts";
import Logo from "@/components/common/Logo.tsx";
import {Title} from "./Title";
import {Config} from "./Config";
import {ExitButton} from "./ExitButton";
import {memo} from "react";
import {PlayerAvatar} from "@/screens/Playground/Header/PlayerAvatar";
import {useDiagramStore} from "@/contexts/DiagramContext";

export const Header = memo(() => {
  const erd = useSharedDiagramStore(state => state.erd)
  const clients = useDiagramStore(state => state.clients)
  return (
    <Group align={"center"} gap={"5px"} px={"5px"} h={"100%"}>
      <Logo/>
      <Title/>
      <Config data={erd}/>
      <Avatar.Group ml={"auto"}>
        {clients.map(client => (
          <PlayerAvatar client={client} key={client.id}/>
        ))}
      </Avatar.Group>
      <ExitButton/>
    </Group>
  )
})
