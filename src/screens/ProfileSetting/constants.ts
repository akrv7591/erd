import {IconLock, IconProps, IconSettings} from "@tabler/icons-react";
import {ForwardRefExoticComponent, RefAttributes} from "react";

interface Tab {
  label: string
  value: ProfileSettingTab.tab
  Icon:  ForwardRefExoticComponent<Omit<IconProps, "ref"> & RefAttributes<SVGSVGElement>>
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
