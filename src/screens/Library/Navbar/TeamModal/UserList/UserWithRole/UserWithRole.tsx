import {ActionIcon, Avatar, Badge, Group, Image, TextInput, Tooltip} from "@mantine/core";
import {IconTrash, IconUser} from "@tabler/icons-react";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {notifications} from "@mantine/notifications";
import {memo, useCallback, useMemo, useState} from "react";
import {TeamUser} from "@/types/log-to/team-user.ts";
import {useUserTeam} from "@/hooks";
import {UserTeam} from "@/types/log-to/user-team.ts";
import {deleteUserFromTeamApi, updateTeamUserRoleApi} from "@/api/logto/team";
import {useLogToAuthStore} from "@/stores/useLogToAuthStore.ts";
import {RoleSelect} from "../RoleSelect";

const UserAvatar = ({src}: { src: string }) => {
  return (
    <Avatar size={"sm"} radius={"md"}>
      {src ? (
        <Image src={src}/>
      ) : (
        <IconUser size={20}/>
      )}
    </Avatar>
  )
}

const DeleteUser = memo(({team, user}: { team: UserTeam, user: TeamUser }) => {
  const userDeleteMutation = useMutation({
    mutationKey: [`delete-user-from-team-${team.id}-${user.id}`],
    mutationFn: deleteUserFromTeamApi,
  })

  const queryClient = useQueryClient()
  const onDelete = () => {
    userDeleteMutation.mutate({teamId: team.id, userId: user.id}, {
        onSuccess: () => {
          notifications.show({
            title: "Success",
            message: `${user.primaryEmail} is successfully deleted from team`
          })
          queryClient.refetchQueries({
            queryKey: [team.id]
          })
        },
        onError: () => {
          notifications.show({
            title: "Failed",
            message: `Failed to delete ${user.primaryEmail}`,
            color: "red"
          })
        }
      }
    )
  }

  return (
    <ButtonWithConfirm
      isDanger
      tooltip={"Delete user"}
      target={(
        <ActionIcon
          disabled={userDeleteMutation.isPending}
          variant={"default"}
          size={"36px"}
        >
          <IconTrash/>
        </ActionIcon>
      )}
      message={`Do you really want to delete ${user.primaryEmail}`}
      onConfirm={onDelete}
    />
  )
})

interface Props {
  user: TeamUser
}

export const UserWithRole = memo(({user}: Props) => {
  const {isOwner, team} = useUserTeam()
  const authorizedUser = useLogToAuthStore(state => state.user)
  const roles = useLogToAuthStore(state => state.roles)
  const [role, setRole] = useState(user.organizationRoles.map(role => role.id)[0])
  const roleMutation = useMutation({
    mutationKey: ['role-mutation', team.id, user.id],
    mutationFn: updateTeamUserRoleApi
  })
  const {canEdit, isUserOwner} = useMemo(() => {
    const roles = user.organizationRoles.map(role => role.name)
    const isUserOwner = roles.includes("owner")
    const isUserAdmin = roles.includes("admin")
    let canEdit = true

    if (isUserOwner) {
      canEdit = false
    }

    const isOwnUser = user.id === authorizedUser?.sub

    if (isOwnUser) {
      canEdit = false
    }

    if (!isOwner && isUserAdmin) {
      canEdit = false
    }

    return {
      canEdit,
      isUserOwner
    }
  }, [roles, user, authorizedUser, isOwner])


  const handleRoleChange = useCallback((role: string) => {
    roleMutation.mutate({
      teamId: team.id,
      userId: user.id,
      roleId: role
    }, {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: `${user.primaryEmail} role changed successfully`
        })
        setRole(role)
      },
      onError: () => notifications.show({
        color: "red",
        title: "Failed",
        message: `Failed to change ${user.primaryEmail} role`,
      })
    })
  }, [setRole, roleMutation])


  return (
    <Group align={"flex-end"} gap={"5px"}>
      {canEdit ? (
        <>
          <TextInput
            value={user.primaryEmail}
            placeholder={"user@erdiagramly.com"}
            style={{flex: 1}}
            disabled
            leftSection={(
              <UserAvatar src={user.avatar}/>
            )}
          />
          <RoleSelect role={role} onChange={handleRoleChange} loading={roleMutation.isPending}/>
          <DeleteUser team={team} user={user}/>
        </>
      ) : (
        <TextInput
          value={user.primaryEmail}
          placeholder={"user@erdiagramly.com"}
          style={{flex: 1}}
          leftSection={(
            <UserAvatar src={user.avatar}/>
          )}
          rightSection={(() => {
            const description = roles.find(r => r.id === role)?.description
            return (
              <Tooltip label={description} position={"top"}>
                <Badge variant={"default"}>{isUserOwner ? "Owner" : "Admin"}</Badge>
              </Tooltip>
            )
          })()}
          rightSectionWidth={100}
          disabled
        />
      )}
    </Group>
  )
})
