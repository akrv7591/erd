import {Button, Card, Group, InputLabel, Select, Stack, TextInput} from "@mantine/core";
import {useTeamFormContext} from "@/contexts/forms/TeamFormContext.ts";
import {ROLE} from "@/enums/role.ts";
import {isEmail, useForm} from "@mantine/form";
import {getRoleDescription, roleData} from "@/utility/role-util.ts";
import UserWithRole from "@/components/layouts/LibraryLayout/Navbar/TeamModal/UserWithRole.tsx";

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

  const description = getRoleDescription(addUserForm.values.role)
  const onSubmit = addUserForm.onSubmit(data => {
    form.setValues(cur => ({
      ...cur, users: [...cur.users as any[], {
        email: data.email,
        UserTeam: {
          role: data.role,
          pending: true,
        }
      }]
    }))
  })

  return (
    <Stack>
      <InputLabel>
        Users
      </InputLabel>
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
          <Button fullWidth onClick={() => {
            onSubmit()
          }}>
            Add
          </Button>
        </Stack>
      </Card>
    </Stack>
  )
}
