import {Avatar, Button, Group, Menu, rem, Text} from "@mantine/core";
import {IconLogout, IconUser} from "@tabler/icons-react";
import {useAuthStore} from "@/stores/useAuthStore";
import {useNavigate} from "react-router-dom";
import {notifications} from "@mantine/notifications";

export default function Account() {
  const [user, logout] = useAuthStore(state => [state.getAuthorization(), state.logout])
  const navigate = useNavigate()
  const onLogout = () => logout(() => {
    navigate("/")
    notifications.show({
      title: "Logout",
      message: "Logout successful"
    })
  })

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button variant={"transparent"} size={"sm"}>
          <Group gap={"5px"}>
            <Avatar size={30}>
              <IconUser size={15} stroke={1}/>
            </Avatar>
            <Text ml={"5px"} size={"sm"} c={"var(--mantine-color-text)"}>{user?.name}</Text>
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          color="red"
          leftSection={<IconLogout style={{width: rem(14), height: rem(14)}}/>}
          onClick={onLogout}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
