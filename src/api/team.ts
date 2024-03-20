import {IListQuery} from "@/hooks/useListQuery.ts";
import erdApi from "@/api/erdApi.tsx";
import {IUserTeam} from "@/types/data/db-model-interfaces";
import {IApiList} from "@/types/data/util";
import {IFormTeam} from "@/contexts/forms/TeamFormContext.ts";
import {useLibraryStore} from "@/stores/useLibrary.ts";


export const userTeamApi = (teamId: string) => erdApi.get<IUserTeam>(`/v1/team/${teamId}/user-permission`)
  .then(res => res.data)
export const teamListApi = (params: IListQuery) => erdApi.get<IApiList<IFormTeam>>("/v1/team", {
  params
})
  .then(res => res.data)
  .then(async (data) => {
    const roles = await Promise.all(data.rows.map(team => userTeamApi(team.id)))

    return {
      ...data,
      rows: data.rows.map((team, index) => ({
        ...team,
        userTeam: roles[index]
      }))
    }
  })
  .then((data) => {
    useLibraryStore.setState({teams: data.rows})
    return data
  })
