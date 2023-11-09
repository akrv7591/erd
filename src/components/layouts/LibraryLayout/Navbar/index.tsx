import {ActionIcon, Group, rem, Stack, Text, Tooltip,} from '@mantine/core';
import {IconPlus} from '@tabler/icons-react';
import classes from './style.module.css';
import TeamModal from "./TeamModal";
import {useModal} from "../../../../hooks/useModal.ts";
import TeamList from "./TeamList";


export default function Navbar() {
  const modal = useModal({
    initialOpen: false,
    baseTitle: "Team",
    initialType: 'create'
  })

  const openModal = () => modal.open("create")


  return (
    <nav className={classes.navbar}>
      <TeamModal {...modal.modalProps}/>

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="sm" fw={500} c="dimmed">
            Teams
          </Text>
          <Tooltip label="Create team" withArrow position="right">
            <ActionIcon onClick={openModal}>
              <IconPlus style={{width: rem(12), height: rem(12)}} stroke={1.5}/>
            </ActionIcon>
          </Tooltip>
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
