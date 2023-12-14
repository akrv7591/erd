import {UseFormReturnType} from "@mantine/form";
import {IErd, IUserWithThrough} from "../../../types/data/erd";
import {ActionIcon, Badge, Checkbox, Group} from "@mantine/core";
import {IconTrash, IconUser, IconUserShield} from "@tabler/icons-react";

interface Props {
  form: UseFormReturnType<IErd>
  user: IUserWithThrough
  i: number
}

export default function UserWithPermissions({form, user, i}: Props) {
  const isUserAdmin = user.UserErd.isAdmin
  return (
    <Group w={"100%"} key={user.email}>
      <Badge
        color={isUserAdmin ? "blue" : "green"}
        leftSection={isUserAdmin ? <IconUserShield size={20}/> : <IconUser size={20}/>}
        variant={"light"}
        radius={"xs"}
        size={"xl"}
        style={{flex: 1, justifyContent: "flex-start"}}
        fw={"normal"} tt={"lowercase"}
      >
        {user.email}
      </Badge>
      <Group>
        <Checkbox
          label={"Administrator"} {...form.getInputProps(`users.${i}.UserErd.isAdmin`, {type: "checkbox"})}
          onChange={e => {
            const checked = e.target.checked
            if (checked) {
              form.setFieldValue(`users.${i}.UserErd.canRead`, true)
              form.setFieldValue(`users.${i}.UserErd.canWrite`, true)
              form.setFieldValue(`users.${i}.UserErd.canDelete`, true)
            } else {
              form.setFieldValue(`users.${i}.UserErd.canRead`, true)
              form.setFieldValue(`users.${i}.UserErd.canWrite`, false)
              form.setFieldValue(`users.${i}.UserErd.canDelete`, false)
            }
            form.setFieldValue(`users.${i}.UserErd.isAdmin`, checked)

          }}/>
        <Checkbox
          label={"Read"} {...form.getInputProps(`users.${i}.UserErd.canRead`, {type: "checkbox"})}/>
        <Checkbox
          label={"Write"} {...form.getInputProps(`users.${i}.UserErd.canWrite`, {type: "checkbox"})}/>
        <Checkbox
          label={"Delete"} {...form.getInputProps(`users.${i}.UserErd.canDelete`, {type: "checkbox"})}/>
        <ActionIcon color={"red"} onClick={() => {
          form.setFieldValue("users", form.values.users!.filter(u => u.id !== user.id))
        }}>
          <IconTrash/>
        </ActionIcon>
      </Group>
    </Group>
  )
}
