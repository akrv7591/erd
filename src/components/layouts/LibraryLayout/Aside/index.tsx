import {Group, Stack, Text,} from '@mantine/core';
import classes from './style.module.css';
import TeamList from "./UserList";
import {useLibraryStore} from "../../../../stores/useLibrary.ts";


export default function Aside() {
  const team = useLibraryStore(state => state.team)

  return (
    <nav className={classes.navbar}>
      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="sm" fw={500} c="dimmed">
            {team?.name} members
          </Text>
        </Group>
        <div className={classes.collections}>
          <Stack align={"center"} gap={"2px"}>
            <TeamList/>
          </Stack>
        </div>
      </div>
    </nav>
  );
}
