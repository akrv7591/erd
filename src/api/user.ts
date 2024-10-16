import erdApi from "@/api/erdApi.ts";
import {PasswordSetForm} from "@/screens/ProfileSetting/Panel/SecurityPanel/SecurityPanel.tsx";
import {QueryFunction} from "@tanstack/react-query";
import {User} from "@/types/log-to/user.ts";

const userProfileUpdateApi = (data: FormData) => erdApi.patch(`/v1/users/${data.get("id")}`, data)
  .then(async (res) => {
    // await useAuthStore.getState().fetchAndSetUser()

    return res
  })

const userPasswordSet = (data: Partial<PasswordSetForm>) => erdApi.post(`/v1/set-password`, data)
  .then(async (res) => {
    // await useAuthStore.getState().fetchAndSetUser()

    return res
  })

const userWithProfileApi: QueryFunction<User, [string]> = async ({queryKey}) => {
  return erdApi.get<User>(`/v1/users/${queryKey[0]}`)
    .then(res => res.data)
}


export {
  userProfileUpdateApi,
  userPasswordSet,
  userWithProfileApi,
}
