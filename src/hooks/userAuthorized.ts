import {useLogToAuthStore} from "@/stores/useLogToAuthStore.ts";

export const userAuthorized = (): boolean => {
  const accessToken = useLogToAuthStore(state => state.accessToken)

  if (!accessToken) {
    return false
  }

  return true
}
