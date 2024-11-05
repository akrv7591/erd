import {Box, Container, Divider, Tabs, Title} from "@mantine/core";
import GeneralPanel from "@/screens/ProfileSetting/Panel/GeneralPanel";
import {useProfile} from "@/screens/ProfileSetting/ProfileContext";
import {ProfileSettingTab} from "@/screens/ProfileSetting/constants";
import classes from "@/screens/ProfileSetting/style.module.css";
import SecurityPanel from "@/screens/ProfileSetting/Panel/SecurityPanel/SecurityPanel";

const ProfileSettingMain = () => {
  const {selectedTab, onTabChange} = useProfile()
  return (
    <Box>
      <Container py={"lg"}>
        <Title>Profile Settings</Title>
      </Container>
      <Divider/>
      <Container>
        <Tabs value={selectedTab} variant={"pills"} color={"var(--mantine-color-dark-5)"}>
          <Tabs.List>
            {ProfileSettingTab.tabs.map(tab => (
              <Tabs.Tab
                miw={120}
                variant={"default"}
                value={tab.value}
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={classes.tab}
                leftSection={<tab.Icon size={15}/>}
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Divider mt={"5px"}/>
          <Tabs.Panel value={ProfileSettingTab.tab.general}>
            <GeneralPanel/>
          </Tabs.Panel>
          <Tabs.Panel value={ProfileSettingTab.tab.security}>
            <SecurityPanel/>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </Box>
  )
}

export default ProfileSettingMain
