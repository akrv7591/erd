import classes from "../style.module.css";
import {ActionIcon, Avatar, Box, Group, Text, Tooltip} from "@mantine/core";
import {IconSettings, IconUsersGroup} from "@tabler/icons-react";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {useModal} from "@/hooks/useModal.ts";
import TeamModal from "../TeamModal";
import {IFormTeam} from "@/contexts/forms/TeamFormContext.ts";
import {ROLE} from "@/enums/role.ts";

interface Props {
  team: IFormTeam
}

export default function Team({team}: Props) {
  const t = useLibraryStore(state => state.team)
  const setTeam = useLibraryStore(state => state.setTeam)
  const selectedTeam = useLibraryStore(state => state.team)
  const modal = useModal({
    baseTitle: "Team",
    initialType: "update",
    initialOpen: false
  })
  const isAdmin = team.UserTeam.role === ROLE.ADMIN
  return (
    <>
      <TeamModal {...modal.modalProps} data={team}/>
      <Group
        onClick={() => setTeam(t === team? null: team)}
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
          <Box className={classes.teamSettingIcon} onClick={e => {
            e.stopPropagation()
            modal.open("update")
          }}>
            <Tooltip label={"Team settings"}>
              <ActionIcon>
                <IconSettings stroke={1} size={15}/>
              </ActionIcon>
            </Tooltip>
          </Box>
        )}

      </Group>
    </>

  )
}
