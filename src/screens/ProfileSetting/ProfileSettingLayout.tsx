import {AppShell} from "@mantine/core";
import {Header} from "@/components/common/Header";
import ProfileSettingMain from "@/screens/ProfileSetting/ProfileSettingMain";
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
          <ProfileSettingMain/>
        </AppShell.Main>
      </AppShell>
    </ProfileContextProvider>
  )
}

export default ProfileSettingLayout
