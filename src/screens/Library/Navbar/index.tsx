import {ActionIcon, Group, rem, Text, Tooltip,} from '@mantine/core';
import {IconPlus} from '@tabler/icons-react';
import classes from './style.module.css';
import TeamModal from "./TeamModal";
import {useModal} from "@/hooks/useModal.ts";
import TeamList from "./TeamList";
import {ITeam} from "@/types/data/db-model-interfaces.ts";


export default function Navbar() {
  const modal = useModal<ITeam>({
    initialOpen: false,
    baseTitle: "Team",
    initialType: 'create'
  })

  const openModal = () => modal.open({type: "create"})

  return (
    <nav>
      <TeamModal {...modal.modalProps}/>
      <div>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="sm" fw={500} c="dimmed">
            Teams
          </Text>
          <Tooltip label="Create team" withArrow position="right">
            <ActionIcon onClick={openModal} variant={"default"} size={"md"}>
              <IconPlus style={{width: rem(12), height: rem(12)}} stroke={1.5}/>
            </ActionIcon>
          </Tooltip>
        </Group>
        <TeamList/>
      </div>
    </nav>
  );
}
