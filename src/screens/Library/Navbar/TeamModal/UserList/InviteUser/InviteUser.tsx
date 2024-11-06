import {memo} from "react";
import {Button, Card, Group, Stack, TextInput, Tooltip} from "@mantine/core";
import {useForm} from "@mantine/form";
import {useMutation} from "@tanstack/react-query";
import {teamInviteUserApi} from "@/api/logto/team";
import {notifications} from "@mantine/notifications";
import {useUserTeam, useRoles} from "@/hooks";
import {RoleSelect} from "../RoleSelect";

type Props = {
  onSuccessfulInvite: VoidFunction
}

export const InviteUser = memo((props: Props) => {
  const {team} = useUserTeam()
  const roles = useRoles()
  const {values, reset, setValues, getInputProps, isTouched, isValid} = useForm({
    initialValues: {
      email: "",
      role: roles.data.find(role => role.name === "spectator")!.id
    },
    validateInputOnBlur: true,
  })

  const {mutate, isPending} = useMutation({
    mutationKey: ["invite-user"],
    mutationFn: teamInviteUserApi
  })

  const handleSubmit = () => {
    if (!isValid()) {
      return
    }
    mutate({
      invitee: values.email,
      teamId: team.id,
      teamName: team.name,
      roleId: values.role
    }, {
      onSuccess: () => {
        notifications.show({
          title: "Success",
          message: `${values.email} invited successfully`
        })
        reset()
        props.onSuccessfulInvite()
      },
      onError: () => notifications.show({
        title: "Failed",
        message: `Failed to invite ${values.email} (Please try again)`,
        color: "red"
      })
    })
  }

  const handleRoleValueChange = (role: string) => {
    setValues({role})
  }

  return (
    <Card title={"Add new user"}>
      <Stack>
        <Group align={"flex-start"}>
          <TextInput
            {...getInputProps("email")}
            label={"Invite user"}
            placeholder={"Enter email"}
            style={{flex: 1}}
          />
          <RoleSelect role={values.role} onChange={handleRoleValueChange} label={"Select role"}/>
        </Group>
        {isTouched("email") && (
          <Tooltip label={"Invite new user"}>
            <Button
              fullWidth
              variant={"filled"}
              onClick={handleSubmit}
              loading={isPending}
            >
              Invite
            </Button>
          </Tooltip>
        )}
      </Stack>
    </Card>
  )
})
