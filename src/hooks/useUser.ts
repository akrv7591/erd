import {useLogToAuthStore} from "@/stores/useLogToAuthStore.ts";

export const useUser = () => {
  const user = useLogToAuthStore(state => state.user)

  if (!user) {
    throw new Error("useUser must be used within a authenticated component")
  }

  return user
}
