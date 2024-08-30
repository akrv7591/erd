import erdApi from "@/api/erdApi.ts";
import {IUser} from "@/types/data/db-model-interfaces.ts";
import {PasswordSetForm} from "@/screens/ProfileSetting/Panel/SecurityPanel/SecurityPanel.tsx";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {IApiList} from "@/types/data/util.ts";

export const userListForTeamModal = async (teamId: string) => erdApi.get<IApiList<IUser>>(`/v1/team/${teamId}/user`)
    .then(response => response.data)


export const userProfileUpdateApi = (data: FormData) => erdApi.patch(`/v1/users/${data.get("id")}`, data)
  .then(async (res) => {
    await useAuthStore.getState().fetchAndSetUser()

    return res
  })

export const userPasswordSet = (data: Partial<PasswordSetForm>) => erdApi.post(`/v1/set-password`, data)
  .then(async (res) => {
    await useAuthStore.getState().fetchAndSetUser()

    return res
  })

export const userWithProfileApi = (id: string) => erdApi.get<IUser>(`/v1/users/${id}`)
  .then(res => res.data)
