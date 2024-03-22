import {createContext, FC, PropsWithChildren, useCallback, useContext, useState} from "react";
import {ProfileSettingTab} from "@/screens/ProfileSetting/constants.ts";


interface ProfileContext {
  selectedTab: ProfileSettingTab.tab
  onTabChange: (tab: ProfileSettingTab.tab) => void
}

export const ProfileContext = createContext<ProfileContext>({} as ProfileContext)

export const ProfileContextProvider: FC<PropsWithChildren> = ({children}) => {
  const [selectedTab, setTab] = useState<ProfileSettingTab.tab>(ProfileSettingTab.tab.general)

  const onTabChange = useCallback((newTab: ProfileSettingTab.tab) => {
    setTab(newTab)
  }, [setTab])
  return (
    <ProfileContext.Provider value={{selectedTab, onTabChange}}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => useContext(ProfileContext)
