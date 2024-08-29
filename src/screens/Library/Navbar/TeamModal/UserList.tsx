import {Button, Card, Group, InputLabel, Select, Stack, TextInput} from "@mantine/core";
import {ROLE} from "@/enums/role.ts";
import {isEmail, useForm} from "@mantine/form";
import {getRoleDescription, roleData} from "@/utility/role-util.ts";
import {UserWithRole} from "@/screens/Library/Navbar/TeamModal/UserWithRole.tsx";
import erdApi from "@/api/erdApi.tsx";
import {ApiUtils} from "@/utility/ApiUtils.ts";
import {notifications} from "@mantine/notifications";
import {memo} from "react";
import {IUser} from "@/types/data/db-model-interfaces.ts";
import {useQuery} from "@tanstack/react-query";
import {IApiList} from "@/types/data/util.ts";
import {teamUserListApi} from "@/api/team.ts";

const defaultNewUserInfo = {
  email: "",
  role: ROLE.READ
}

interface Props {
  teamId: string
}

export const UserList = memo((props: Props) => {
  const addUserForm = useForm({
    initialValues: defaultNewUserInfo,
    validate: {
      email: isEmail("User email is required")
    }
  })
  const {data} = useQuery<IApiList<IUser>, {}, IApiList<IUser>, [string]>({
    queryKey: [props.teamId],
    queryFn: teamUserListApi
  })

  const handleSubmit = addUserForm.onSubmit(async (data) => {
    try {
      const res = await erdApi.post<IUser>(`/v1/team/${props.teamId}/user-invite`, data)

      if (ApiUtils.isRequestSuccess(res)) {
        notifications.show({
          title: "Success",
          message: `${data.email} invited successfully`
        })
      }
    } catch (e) {
      console.error(e)
      notifications.show({
        title: "Failed",
        message: "Failed to invite user (Please try again)",
        color: "red"
      })
    }
  })

  const description = getRoleDescription(addUserForm.values.role)

  return (
    <Stack>
      <InputLabel>Users</InputLabel>
      <Stack mah={"300px"} style={{overflow: "scroll"}}>
        {data && data.rows.map((user) => (
          <UserWithRole key={user.id} user={user}/>
        ))}
      </Stack>
      <Card title={"Add new user"}>
        <Stack>
          <Group align={"flex-start"}>
            <TextInput
              {...addUserForm.getInputProps("email", {withFocus: true})}
              label={"Invite user"}
              description={"by email"}
              placeholder={"user@erdiagramly.com"}
              style={{flex: 1}}
            />
            <Select
              {...addUserForm.getInputProps("role")}
              label={"Role"}
              data={roleData}
              checkIconPosition={"right"}
              description={description}
            />
          </Group>
          <Button fullWidth onClick={() => handleSubmit}>
            Add
          </Button>
        </Stack>
      </Card>
    </Stack>
  )
})
