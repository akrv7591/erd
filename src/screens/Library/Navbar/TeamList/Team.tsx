import classes from "../style.module.css";
import {ActionIcon, Avatar, Group, Text, Tooltip} from "@mantine/core";
import {IconSettings, IconUsersGroup} from "@tabler/icons-react";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {useModal} from "@/hooks/useModal.ts";
import TeamModal from "../TeamModal";
import {memo, MouseEventHandler, useCallback, useMemo} from "react";
import {ITeam, IUserTeam} from "@/types/data/db-model-interfaces.ts";
import {useQuery} from "@tanstack/react-query";
import {userTeamApi} from "@/api/team.ts";
import {ROLE} from "@/enums/role.ts";
import {useAuthStore} from "@/stores/useAuthStore.ts";

interface Props {
  team: ITeam
}

const Team = memo(({team}: Props) => {
  const setTeam = useLibraryStore(state => state.setTeam)
  const selectedTeam = useLibraryStore(state => state.team)
  const user = useAuthStore(state => state.user)
  const modal = useModal<ITeam>({
    baseTitle: "Team",
    initialType: "update",
    initialOpen: false
  })
  const {data} = useQuery<IUserTeam, {}, IUserTeam, [string, string]>({
    queryKey: [team.id, user.id],
    queryFn: userTeamApi
  })

  const isAdmin = useMemo(() => {
    if (!data) {
      return false
    }

    return data.role === ROLE.ADMIN
  }, [data])

  const handleSettingsClick: MouseEventHandler = useCallback(async (e) => {
    e.stopPropagation()
    modal.open({type: "update", data: team})
  }, [])

  return (
    <>
      <TeamModal {...modal.modalProps}/>
      <Group
        onClick={() => setTeam(selectedTeam === team ? null : team)}
        className={selectedTeam === team ? classes.teamActive : classes.team}
        wrap={"nowrap"}
        gap={0}
      >
        <Avatar size={"sm"}>
          <IconUsersGroup stroke={1} size={18}/>
        </Avatar>
        <Text mr={"auto"} size={"sm"} truncate={"end"} ml={"sm"}>
          {team.name}
        </Text>
        {isAdmin && (
          <Tooltip label={"Team settings"}>
            <ActionIcon onClick={handleSettingsClick} variant={"default"} size={"md"}>
              <IconSettings stroke={1} size={15}/>
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </>

  )
})

export default Team
