import {QueryFunctionContext} from "@tanstack/react-query";
import erdApi from "@/api/erdApi.tsx";
import {IUser} from "@/types/data/db-model-interfaces";
import {userTeamApi} from "@/api/team.ts";
import {PasswordSetForm} from "@/screens/ProfileSetting/Panel/SecurityPanel/SecurityPanel.tsx";
import {useAuthStore} from "@/stores/useAuthStore.ts";

export const userListForTeamModal = (params: QueryFunctionContext) => {
  const teamId = params.queryKey[0] as string

  if (!teamId) return []

  return erdApi.get<IUser[]>(`/v1/team/${teamId}/user-list`)
    .then(response => response.data)
    .then(async data => {
      const roles = await Promise.all(data.map(() => userTeamApi(teamId)))

      return data.map((user, index) => ({
        ...user,
        userTeam: roles[index]
      }))

    })
}

export const userProfileUpdateApi = (data: FormData) => erdApi.patch(`/v1/user/${data.get("id")}`, data)
  .then(async (res) => {
    await useAuthStore.getState().fetchAndSetUser()

    return res
  })

export const userPasswordSet = (data: Partial<PasswordSetForm>) => erdApi.post(`/v1/set-password`, data)
  .then(async (res) => {
    await useAuthStore.getState().fetchAndSetUser()

    return res
  })
