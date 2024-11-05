import {ActionIcon, Menu, rem} from "@mantine/core";
import {IconLogout, IconUserCog} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";
import {useUser} from "@/hooks";
import {useLogto} from "@logto/react";
import {memo, useCallback} from "react";
import {config} from "@/config/config";
import {ProfilePicture} from "@/components/common/ProfilePicture";

export const Account = memo(() => {
  const {signOut} = useLogto()
  const user = useUser()
  const navigate = useNavigate()
  const handleLogout = useCallback(() => signOut(config.client.url), [])

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon size={40} variant={"transparent"}>
          <ProfilePicture src={user.picture} avatarProps={{size: "md"}}/>
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
          onClick={handleLogout}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
})
