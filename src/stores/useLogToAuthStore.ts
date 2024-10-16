import {create} from "zustand";
import {LOG_TO} from "@/types/log-to.ts";
import StorageUtils from "@/utility/StorageUtils.ts";
import {useLogto} from "@logto/react"
import {config} from "@/config/config.ts";
import {roleApis} from "@/api/logto/role.ts";
import {Roles} from "@/types/log-to/roles.ts";

interface LogToAuthStoreState {
  authorized: boolean
  accessToken: string | null
  user: LOG_TO.UserInfo | null
  roles: Roles[]
}

interface LogToAuthStoreActions {
  initialize: (logTo: ReturnType<typeof useLogto>) => void
}

export type LogToAuthStore = LogToAuthStoreState & LogToAuthStoreActions

export const useLogToAuthStore = create<LogToAuthStore>()((setState) => ({
  accessToken: null,
  user: null,
  authorized: false,
  roles: [],

  initialize: async (logTo) => {
    const [userInfo, accessToken] = await Promise.all([
      logTo.fetchUserInfo(),
      logTo.getAccessToken(config.server.baseUrl),
    ])

    if (accessToken) {
      StorageUtils.setAuthorization(accessToken as string)
    }

    const roles = await roleApis.list()

    setState({
      accessToken,
      user: LOG_TO.userInfoResponseToUserInfo(userInfo as unknown as LOG_TO.UserInfoResponse),
      authorized: true,
      roles
    })
  }
}))
