import classes from "../style.module.css";
import {ActionIcon, Avatar, Badge, Box, Group, Text, Tooltip} from "@mantine/core";
import {IconSettings, IconUsersGroup} from "@tabler/icons-react";
import {ITeam} from "../../../../../types/data/team";
import {useLibraryStore} from "../../../../../stores/useLibrary.ts";
import {useAuthStore} from "../../../../../stores/useAuthStore.ts";
import {useModal} from "../../../../../hooks/useModal.ts";
import TeamModal from "../TeamModal";

interface Props {
  team: ITeam
}

export default function Team({team}: Props) {
  const [selectedTeam, setTeam] = useLibraryStore(state => [state.team, state.setTeam])
  const clientUser = useAuthStore(state => state.getAuthorization())
  const isAdmin = team.users.some(user => user.UserTeam.isAdmin && user.UserTeam.userId === clientUser?.id)
  const modal = useModal({
    baseTitle: "Team",
    initialType: "update",
    initialOpen: false
  })
  return (
    <Group
      onClick={() => setTeam(team)}
      className={selectedTeam === team ? classes.teamActive : classes.team}
      wrap={"nowrap"}
      gap={0}
    >
      <TeamModal {...modal.modalProps} data={team}/>
      <Avatar size={"sm"}>
        <IconUsersGroup stroke={1} size={18}/>
      </Avatar>
      <Text mr={"auto"} size={"sm"} truncate={"end"} ml={"sm"}>
        {team.name}
      </Text>
      <Badge size={"xs"} color={isAdmin ? "var(--mantine-color-blue-filled)" : "var(--mantine-color-gray-filled)"}>
        {isAdmin ? "admin" : "member"}
      </Badge>

      {
        isAdmin && (
          <Box className={classes.teamSettingIcon}>
            <Tooltip label={"Team settings"}>
              <ActionIcon onClick={e => {
                e.stopPropagation()
                modal.open("update")
              }}>
                <IconSettings stroke={1} size={15}/>
              </ActionIcon>
            </Tooltip>
          </Box>
        )
      }


    </Group>
  )
}
