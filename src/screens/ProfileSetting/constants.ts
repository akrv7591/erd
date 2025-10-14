import {IconLock, IconSettings} from "@tabler/icons-react";


interface Tab {
  label: string
  value: ProfileSettingTab.tab
  Icon: typeof IconLock | typeof IconSettings
}

export namespace ProfileSettingTab {
  export enum tab {
    general = "general",
    security = "security",
  }

  export const tabs: Tab[] = [
    {label: "General", value: tab.general, Icon: IconSettings},
    {label: "Security", value: tab.security, Icon: IconLock},
  ]
}
