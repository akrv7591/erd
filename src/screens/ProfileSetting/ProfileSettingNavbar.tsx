import {NavLink, Stack, Title} from "@mantine/core";
import {ProfileSettingTab} from "@/screens/ProfileSetting/constants.ts";
import {useProfile} from "@/screens/ProfileSetting/ProfileContext.tsx";
import classes from "./style.module.css"

const ProfileSettingNavbar = () => {
  const {selectedTab, onTabChange} = useProfile()
  return (
    <Stack p={"xs"} px={"5px"} gap={"xs"}>
      <Title ml={"5px"} order={4}>Profile Settings</Title>
      <Stack gap={0}>
        {ProfileSettingTab.tabs.map(tab => (
          <NavLink
            variant={"default"}
            active={tab.value === selectedTab}
            label={tab.label}
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={classes.tab}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default ProfileSettingNavbar
