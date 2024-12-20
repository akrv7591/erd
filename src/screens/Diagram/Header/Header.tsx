import { Avatar, Group } from "@mantine/core";
import { AppLogo } from "@/components/common/AppLogo";
import { Title } from "./Title";
import { ExitButton } from "./ExitButton";
import { memo } from "react";
import { PlayerAvatar } from "@/screens/Diagram/Header/PlayerAvatar";
import { useDiagramStore } from "@/hooks";
import { UndoRedo } from "@/screens/Diagram/Header/UndoRedo";
import { EntityConfig } from "@/screens/Diagram/Header/EntityConfig";
import classes from "./style.module.css";

export const Header = memo(() => {
  const clients = useDiagramStore((state) => state.clients);
  return (
    <Group className={classes.root}>
      <AppLogo />
      <Title />
      <EntityConfig />
      <UndoRedo />
      <Group ml={"auto"} />
      <Avatar.Group>
        {clients.map((client) => (
          <PlayerAvatar client={client} key={client.id} />
        ))}
      </Avatar.Group>
      <ExitButton />
    </Group>
  );
});
