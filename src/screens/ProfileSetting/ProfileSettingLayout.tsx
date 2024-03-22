import {AppShell} from "@mantine/core";
import Header from "@/components/common/Header/Header.tsx";
import ProfileSettingMain from "@/screens/ProfileSetting/ProfileSettingMain.tsx";
import {ProfileContextProvider} from "@/screens/ProfileSetting/ProfileContext.tsx";

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
