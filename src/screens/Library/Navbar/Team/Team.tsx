import classes from "./style.module.css";
import {ActionIcon, Avatar, Group, Text, Tooltip} from "@mantine/core";
import {IconBrandAsana, IconSettings} from "@tabler/icons-react";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {useModal, useUserTeam} from "@/hooks";
import {TeamModal} from "../TeamModal";
import {memo, MouseEventHandler, useCallback} from "react";
import {UserTeam} from "@/types/log-to/user-team.ts";

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
        <Tooltip label={canEditTeam? "Team settings": "You need at least admin role to edit settings"}>
          <ActionIcon
            disabled={!canEditTeam}
            onClick={handleSettingsClick}
            variant={"subtle"}
            color={"gray"}
            size={"md"}
            bg={canEditTeam? "auto": "transparent"}
          >
            <IconSettings stroke={1} size={15}/>
          </ActionIcon>
        </Tooltip>
      </Group>
    </>

  )
})
