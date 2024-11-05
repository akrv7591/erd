import {AppShell} from "@mantine/core";
import {Header} from "@/components/common/Header";
import Index from "@/screens/ProfileSetting/index";
import {ProfileContextProvider} from "@/screens/ProfileSetting/ProfileContext";

const ProfileSettingLayout = () => {
  return (
    <ProfileContextProvider>
      <AppShell
        header={{
          height: 60
        }}
      >
        <AppShell.Header>
          <Header/>
        </AppShell.Header>
        <AppShell.Main>
          <Index/>
        </AppShell.Main>
      </AppShell>
    </ProfileContextProvider>
  )
}

export default ProfileSettingLayout
