import {IListQuery} from "@/hooks/useListQuery.ts";
import erdApi from "@/api/erdApi.ts";
import {ITeam, IUser, IUserTeam} from "@/types/data/db-model-interfaces.ts";
import {IApiList} from "@/types/data/util.ts";
import {QueryFunction} from "@tanstack/react-query";

const userTeamApi: QueryFunction<IUserTeam, [string, string]> = async ({queryKey}) => erdApi.get<IUserTeam>(`/v1/team/${queryKey[0]}/user/${queryKey[1]}`)
  .then(res => res.data)

const teamUserListApi: QueryFunction<IApiList<IUser>, [string]> = async ({queryKey}) => erdApi.get<IApiList<IUser>>(`/v1/team/${queryKey[0]}/user`)
  .then(res => res.data)

const teamListApi: QueryFunction<IApiList<ITeam>, [string, IListQuery?]> = ({queryKey}) => erdApi.get<IApiList<ITeam>>("/v1/team", {params: queryKey[1] || {}})
  .then(res => res.data)

export {
  userTeamApi,
  teamUserListApi,
  teamListApi,
}

