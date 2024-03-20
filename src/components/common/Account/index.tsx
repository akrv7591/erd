import {ActionIcon, Menu, rem} from "@mantine/core";
import {IconLogout, IconUser} from "@tabler/icons-react";
import {useAuthStore} from "@/stores/useAuthStore";
import {useNavigate} from "react-router-dom";
import {notifications} from "@mantine/notifications";

export default function Account() {
  const logout = useAuthStore(state => state.logout)
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
        <ActionIcon variant={"default"}>
          <IconUser size={20}/>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>
          Profile settings
        </Menu.Item>
        <Menu.Divider/>
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
