import {ActionIcon, Divider, Group, Stack, Text, Tooltip} from '@mantine/core';
import {IconPlus} from '@tabler/icons-react';
import {TeamModal} from "./TeamModal";
import {useModal, useTeamList} from "@/hooks";
import {memo, Suspense, useCallback} from "react";
import {Team} from "./Team";
import {UserTeamProvider} from "@/providers/UserTeamProvider";
import {Personal} from "@/screens/Library/Navbar/Personal";
import {TeamUser} from "@/types/log-to/team-user";

export const Navbar = memo(() => {
  const modal = useModal<TeamUser>({
    initialOpen: false,
    baseTitle: "Team",
    initialType: 'create'
  })

  const {data} = useTeamList()

  const handleTeamModalOpen = useCallback(() => {
    modal.open({type: "create", data: null})
  }, [modal.open])


  return (
    <Suspense>
      <nav style={{height: "calc(100vh - 60px)"}}>
        <TeamModal team={null} {...modal.modalProps}/>
        <Stack gap={"0px"} h={"100%"}>
          <Personal/>
          <Divider/>
          <Group px={"xs"} h={"50px"} w={"100%"} justify={"space-between"}>
            <Text size={"sm"}>Teams</Text>
            <Tooltip label={"Create team"}>
              <ActionIcon size={"md"} variant={"default"} onClick={handleTeamModalOpen}>
                <IconPlus size={15}/>
              </ActionIcon>
            </Tooltip>
          </Group>
          <Stack flex={1} style={{overflow: "scroll"}} gap={"2px"}>
            {data.map(team => (
              <UserTeamProvider userTeam={team} key={team.id}>
                <Team/>
              </UserTeamProvider>
            ))}
          </Stack>
        </Stack>
      </nav>
    </Suspense>
  );
})
