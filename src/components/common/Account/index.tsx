import {Avatar, Button, Group, Menu, rem, Text} from "@mantine/core";
import {
  IconArrowsLeftRight,
  IconLogout,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconUser
} from "@tabler/icons-react";
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
        <Menu.Label>Application</Menu.Label>
        <Menu.Item leftSection={<IconSettings style={{width: rem(14), height: rem(14)}}/>}>
          Settings
        </Menu.Item>
        <Menu.Item leftSection={<IconMessageCircle style={{width: rem(14), height: rem(14)}}/>}>
          Messages
        </Menu.Item>
        <Menu.Item leftSection={<IconPhoto style={{width: rem(14), height: rem(14)}}/>}>
          Gallery
        </Menu.Item>
        <Menu.Item
          leftSection={<IconSearch style={{width: rem(14), height: rem(14)}}/>}
          rightSection={
            <Text size="xs" c="dimmed">
              ⌘K
            </Text>
          }
        >
          Search
        </Menu.Item>

        <Menu.Divider/>

        <Menu.Label>Danger zone</Menu.Label>
        <Menu.Item
          leftSection={<IconArrowsLeftRight style={{width: rem(14), height: rem(14)}}/>}
        >
          Transfer my data
        </Menu.Item>
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
