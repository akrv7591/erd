import classes from "./style.module.css";
import {ActionIcon, Avatar, Group, Text, Tooltip} from "@mantine/core";
import {IconBrandAsana, IconSettings} from "@tabler/icons-react";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {useModal} from "@/hooks/useModal.ts";
import {TeamModal} from "../TeamModal";
import {memo, MouseEventHandler, useCallback} from "react";
import {UserTeam} from "@/types/log-to/user-team.ts";
import {useUserTeam} from "@/contexts/UserTeamContext.ts";

export const Team = memo(() => {
  const {team, canEditTeam} = useUserTeam()
  const setTeam = useLibraryStore(state => state.setTeam)
  const selectedTeam = useLibraryStore(state => state.team)
  const modal = useModal<UserTeam>({
    baseTitle: "Team",
    initialType: "update",
    initialOpen: false
  })

  const handleSettingsClick: MouseEventHandler = useCallback(async (e) => {
    e.stopPropagation()
    modal.open({type: "update", data: team})
  }, [])

  return (
    <>
      <TeamModal team={team} {...modal.modalProps}/>
      <Group
        onClick={() => setTeam(team)}
        className={selectedTeam.id === team.id ? classes.teamActive : classes.team}
        wrap={"nowrap"}
        gap={0}
        mih={"40px"}
      >
        <Avatar size={"sm"} radius={"md"}>
          <IconBrandAsana size={18}/>
        </Avatar>
        <Text mr={"auto"} size={"sm"} truncate={"end"} ml={"sm"}>
          {team.name}
        </Text>
        {canEditTeam && (
          <Tooltip label={"Team settings"}>
            <ActionIcon onClick={handleSettingsClick} variant={"subtle"} color={"gray"} size={"md"}>
              <IconSettings stroke={1} size={15}/>
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </>

  )
})
