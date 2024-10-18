import {ActionIcon, Divider, Group, Stack, Text, Tooltip} from '@mantine/core';
import {IconError404, IconPlus} from '@tabler/icons-react';
import {TeamModal} from "./TeamModal";
import {useModal} from "@/hooks/useModal.ts";
import {memo, useCallback, useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import {userTeamListApi} from "@/api/logto/user.ts";
import {TeamSkeleton} from "./TeamSkeleton";
import {Team} from "./Team";
import {UserTeamProvider} from "@/providers/UserTeamProvider.tsx";
import {Personal} from "@/screens/Library/Navbar/Personal";
import {TeamUser} from "@/types/log-to/team-user.ts";

export const Navbar = memo(() => {
  const modal = useModal<TeamUser>({
    initialOpen: false,
    baseTitle: "Team",
    initialType: 'create'
  })

  const {data = [], status} = useQuery({
    queryKey: ['teams'],
    queryFn: userTeamListApi,
  })

  const renderContent = useMemo(() => {
    switch (status) {
      case "pending":
        return <TeamSkeleton count={10}/>
      case "error":
        return <IconError404/>
      case "success":
        return data.map(team => (
          <UserTeamProvider userTeam={team} key={team.id}>
            <Team/>
          </UserTeamProvider>
        ))
    }
  }, [data, status])

  const handleTeamModalOpen = useCallback(() => {
    modal.open({type: "create", data: null})
  }, [modal.open])


  return (
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
          {renderContent}
        </Stack>
      </Stack>
    </nav>
  );
})
