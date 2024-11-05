import erdApi from "@/api/erdApi";
import {PasswordSetForm} from "@/screens/ProfileSetting/Panel/SecurityPanel/SecurityPanel";
import {QueryFunction} from "@tanstack/react-query";
import {User} from "@/types/log-to/user";

const profileUpdate = (data: FormData) => erdApi.patch(`/v1/users/${data.get("id")}`, data)
  .then(async (res) => {
    // await useAuthStore.getState().fetchAndSetUser()

    return res
  })

const passwordSet = (data: Partial<PasswordSetForm>) => erdApi.post(`/v1/set-password`, data)
  .then(async (res) => {
    // await useAuthStore.getState().fetchAndSetUser()

    return res
  })

const userWithProfileApi: QueryFunction<User, [string]> = async ({queryKey}) => {
  const [userId] = queryKey
  return erdApi.get<User>(`/v1/users/${userId}`)
    .then(res => res.data)
}


export const userApis = {
  profileUpdate,
  passwordSet,
  userWithProfileApi,
}
