import {ActionIcon, Badge, Group, Select, TextInput} from "@mantine/core";
import {useTeamFormContext} from "@/contexts/forms/TeamFormContext.ts";
import {IconTrash} from "@tabler/icons-react";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {roleData} from "@/utility/role-util.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import erdApi from "@/api/erdApi.tsx";
import {notifications} from "@mantine/notifications";
import {AxiosError} from "axios";
import httpStatus from "http-status";
import {IUser, IUserTeam} from "@/types/data/db-model-interfaces.ts";
import {memo} from "react";
import {userTeamApi} from "@/api/team.ts";

interface Props {
  user: IUser
}


export const UserWithRole = memo(({user}: Props) => {
  const form = useTeamFormContext()

  const {data} = useQuery<IUserTeam, {}, IUserTeam, [string, string]>({
    queryKey: [form.values.id, user.id],
    queryFn: userTeamApi
  })

  const userDeleteMutation = useMutation({
    mutationKey: [`delete-user-from-team-${user.email}`],
    mutationFn: (url: string) => erdApi.delete(url),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `${user.email} is successfully deleted from team`
      })
    },
    onError: (error: AxiosError) => {
      switch (error.status) {
        case httpStatus.NOT_FOUND:
          notifications.show({
            title: "Failed",
            message: `Couldn't found ${user.email} in current team`,
            color: "red"
          })
          break
        case httpStatus.INTERNAL_SERVER_ERROR:
          notifications.show({
            title: "Failed",
            message: `Internal server error, Please contact at akrv7591@gmail.com`,
            color: "red"
          })
          break
      }
    }
  })

  if (!data) {
    return null
  }

  const onDelete = () => {
    userDeleteMutation.mutate(`/v1/team/${data.teamId}/delete-user/${data.userId}`)
  }

  const isInvited = data.pending

  return (
    <Group align={"flex-end"} gap={"xs"}>
      <TextInput
        value={user.email}
        placeholder={"user@erdiagramly.com"}
        style={{flex: 1}}
        disabled
        rightSection={isInvited ? <Badge color={"var(--mantine-color-orange-9)"}>Invited</Badge> : null}
        rightSectionWidth={isInvited ? 100 : 0}
      />
      <Select
        value={data.role}
        data={roleData}
        checkIconPosition={"right"}
      />
      <ButtonWithConfirm
        isDanger
        tooltip={"Delete user"}
        target={(
          <ActionIcon variant={"default"} h={"100%"} size={35}>
            <IconTrash/>
          </ActionIcon>
        )}
        message={`Do you really want to delete ${user.email}`}
        onConfirm={onDelete}
      />
    </Group>
  )
})
