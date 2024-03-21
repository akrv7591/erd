import {ActionIcon, Badge, Group, Select, TextInput} from "@mantine/core";
import {useTeamFormContext} from "@/contexts/forms/TeamFormContext.ts";
import {IconTrash} from "@tabler/icons-react";
import ButtonWithConfirm from "@/components/common/ButtonWithConfirm";
import {roleData} from "@/utility/role-util.ts";
import {useMutation} from "@tanstack/react-query";
import erdApi from "@/api/erdApi.tsx";
import {notifications} from "@mantine/notifications";
import {AxiosError} from "axios";
import httpStatus from "http-status";

interface Props {
  i: number
}


export default function UserWithRole(props: Props) {
  const form = useTeamFormContext()

  if (!form.values.users) return null

  const user = form.values.users[props.i]

  const userDeleteMutation = useMutation({
    mutationKey: [`delete-user-from-team-${user.email}`],
    mutationFn: (url: string) => erdApi.delete(url),
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: `${user.email} is successfully deleted from team`
      })
      form.setValues(cur => ({...cur, users: cur.users?.filter(u => u.id !== user.id)}))
    },
    onError: (error: AxiosError) => {
      switch (error.status) {
        case httpStatus.NOT_FOUND:
          notifications.show({
            title: "Failed",
            message: `Couldn't found ${user.email} in current team`,
            color: "red"
          })
          form.setValues(cur => ({...cur, users: cur.users?.filter(u => u.id !== user.id)}))

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

  const onDelete = () => {
    if (user.id) {
      userDeleteMutation.mutate(`/v1/team/${user.userTeam?.teamId}/delete-user/${user.id}`)
    } else {
      form.setValues(cur => ({...cur, users: cur.users?.filter(u => u.id !== user.id)}))
    }
  }

  const isInvited = user.userTeam!.pending
  return (
    <Group align={"flex-end"} gap={"xs"}>
      <TextInput
        {...form.getInputProps(`users.${props.i}.email`)}
        placeholder={"user@erdiagramly.com"}
        style={{flex: 1}}
        disabled
        rightSection={isInvited ? <Badge color={"var(--mantine-color-orange-9)"}>Invited</Badge> : null}
        rightSectionWidth={isInvited ? 100 : 0}
      />
      <Select
        {...form.getInputProps(`users.${props.i}.userTeam.role`)}
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
}
