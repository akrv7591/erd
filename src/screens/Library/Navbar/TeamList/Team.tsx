import classes from "../style.module.css";
import {ActionIcon, Avatar, Group, Text, Tooltip} from "@mantine/core";
import {IconSettings, IconUsersGroup} from "@tabler/icons-react";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {useModal} from "@/hooks/useModal.ts";
import TeamModal from "../TeamModal";
import {IFormTeam} from "@/contexts/forms/TeamFormContext.ts";
import {ROLE} from "@/enums/role.ts";
import {memo, MouseEventHandler, useCallback} from "react";
import {userListForTeamModal} from "@/api/user.ts";

interface Props {
  team: IFormTeam
}

const Team = memo(({team}: Props) => {
  const setTeam = useLibraryStore(state => state.setTeam)
  const selectedTeam = useLibraryStore(state => state.team)
  const modal = useModal<IFormTeam>({
    baseTitle: "Team",
    initialType: "update",
    initialOpen: false
  })
  const isAdmin = team.userTeam.role === ROLE.ADMIN
  const handleSettingsClick: MouseEventHandler = useCallback(async (e) => {
    e.stopPropagation()

    const users = await userListForTeamModal(team.id)
    const data = {
      ...modal.modalProps.data,
      users
    } as IFormTeam
    modal.open({type: "update", data})
  }, [])

  return (
    <>
      <TeamModal {...modal.modalProps} />
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
