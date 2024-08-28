import {ActionIcon, Avatar, Image, Menu, rem} from "@mantine/core";
import {IconLogout, IconUser, IconUserCog} from "@tabler/icons-react";
import {useAuthStore} from "@/stores/useAuthStore";
import {useNavigate} from "react-router-dom";
import {notifications} from "@mantine/notifications";

export default function Account() {
  const logout = useAuthStore(state => state.logout)
  const user = useAuthStore(state => state.user)
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
        <ActionIcon size={40} variant={"transparent"}>
          <Avatar>
            <Image w={40} h={40} src={user.profile?.image?.url} alt={"user-avatar"}/>
          </Avatar>
          <IconUser size={20}/>
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          leftSection={(
            <IconUserCog style={{width: rem(16), height: rem(16)}}/>
          )}
          onClick={() => navigate("/profile/setting")}
        >
          Profile settings
        </Menu.Item>
        <Menu.Divider/>
        <Menu.Item
          color="red"
          leftSection={<IconLogout style={{width: rem(16), height: rem(16)}}/>}
          onClick={onLogout}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
