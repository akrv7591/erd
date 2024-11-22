import {Avatar, Group, Text} from "@mantine/core";
import {AppLogo} from "@/components/common/AppLogo";
import {Title} from "./Title";
import {ExitButton} from "./ExitButton";
import {memo} from "react";
import {PlayerAvatar} from "@/screens/Diagram/Header/PlayerAvatar";
import {useDiagramStore} from "@/hooks";
import {UndoRedo} from "@/screens/Diagram/Header/UndoRedo";
import {EntityConfig} from "@/screens/Diagram/Header/EntityConfig";

export const Header = memo(() => {
  const clients = useDiagramStore(state => state.clients)
  const subscribers = useDiagramStore(state => state.subscribers)
  return (
    <Group align={"center"} gap={"5px"} px={"5px"} h={"100%"}>
      <AppLogo/>
      <Title/>
      <EntityConfig />
      <UndoRedo />
      {subscribers.map(s => (
        <Text key={s}>{s}</Text>
      ))}
      <Group ml={"auto"}/>
      <Avatar.Group>
        {clients.map(client => (
          <PlayerAvatar client={client} key={client.id}/>
        ))}
      </Avatar.Group>
      <ExitButton/>
    </Group>
  )
})
