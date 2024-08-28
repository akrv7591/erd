import erdApi from "@/api/erdApi.tsx";
import {IUser} from "@/types/data/db-model-interfaces.ts";
import {userTeamApi} from "@/api/team.ts";
import {PasswordSetForm} from "@/screens/ProfileSetting/Panel/SecurityPanel/SecurityPanel.tsx";
import {useAuthStore} from "@/stores/useAuthStore.ts";
import {IApiList} from "@/types/data/util.ts";
import {IUserWithUserTeam} from "@/contexts/forms/TeamFormContext.ts";

export const userListForTeamModal = (teamId: string) => {
  return erdApi.get<IApiList<IUser>>(`/v1/team/${teamId}/user-list`)
    .then(response => response.data)
    .then(async data => {
      const roles = await Promise.all(data.rows.map(() => userTeamApi(teamId)))

      return data.rows.map((user, index) => ({
        ...user,
        userTeam: roles[index]
      }) as IUserWithUserTeam)
    })
}

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
