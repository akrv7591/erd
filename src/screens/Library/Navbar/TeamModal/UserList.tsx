import {Button, Card, Group, InputLabel, Select, Stack, TextInput} from "@mantine/core";
import {IUserWithUserTeam, useTeamFormContext} from "@/contexts/forms/TeamFormContext.ts";
import {ROLE} from "@/enums/role.ts";
import {isEmail, useForm} from "@mantine/form";
import {getRoleDescription, roleData} from "@/utility/role-util.ts";
import UserWithRole from "@/screens/Library/Navbar/TeamModal/UserWithRole.tsx";
import erdApi from "@/api/erdApi.tsx";
import {ApiUtils} from "@/utility/ApiUtils.ts";
import {notifications} from "@mantine/notifications";

const defaultNewUserInfo = {
  email: "",
  role: ROLE.READ
}

export default function UserList() {
  const form = useTeamFormContext()
  const addUserForm = useForm({
    initialValues: defaultNewUserInfo,
    validate: {
      email: isEmail("User email is required")
    }
  })

  if (!form.values.users) return null

  const onSubmit = addUserForm.onSubmit(async (data) => {

    try {
      const res = await erdApi.post<IUserWithUserTeam>("/v1/team/invite-user", data)

      if (ApiUtils.isRequestSuccess(res)) {
        notifications.show({
          title: "Success",
          message: `${data.email} invited successfully`
        })
        form.setValues(prevState => {
          if (!prevState.users) {
            return {}
          }

          return {
            users: [
              ...prevState.users,
              res.data
            ]
          }
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
        {form.values.users.map((user, i) => <UserWithRole key={user.email} i={i}/>)}
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
          <Button fullWidth onClick={() => onSubmit()}>
            Add
          </Button>
        </Stack>
      </Card>
    </Stack>
  )
}
