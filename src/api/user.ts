import {PasswordSetForm} from "@/screens/ProfileSetting/Panel/SecurityPanel/SecurityPanel";
import {QueryFunction} from "@tanstack/react-query";
import {User} from "@/types/log-to/user";
import { Axios } from "@/services";

const { api } = Axios.instance;

const profileUpdate = (data: FormData) => api.patch(`/v1/users/${data.get("id")}`, data)
  .then(async (res) => {
    // await useAuthStore.getState().fetchAndSetUser()

    return res
  })

const passwordSet = (data: Partial<PasswordSetForm>) => api.post(`/v1/set-password`, data)
  .then(async (res) => {
    // await useAuthStore.getState().fetchAndSetUser()

    return res
  })

const userWithProfileApi: QueryFunction<User, [string]> = async ({queryKey}) => {
  const [userId] = queryKey
  return api.get<User>(`/v1/users/${userId}`)
    .then(res => res.data)
}

const meApi: QueryFunction<User, [string]> = async () => {
  return api.get<User>("/v1/me").then(response => response.data)
}


export const userApis = {
  profileUpdate,
  passwordSet,
  userWithProfileApi,
  meApi
}
