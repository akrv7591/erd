import {IListQuery} from "@/hooks/useListQuery.ts";
import erdApi from "@/api/erdApi.ts";
import {IApiList} from "@/types/data/util.ts";
import {IErd} from "@/types/data/db-model-interfaces.ts";
import {QueryFunction} from "@tanstack/react-query";

export const erdListApi: QueryFunction<IApiList<IErd>, [string, IListQuery]> = ({queryKey}) => erdApi.get<IApiList<IErd>>("/v1/erd", {params: queryKey[1]})
  .then(res => res.data)

export const deleteErdApi = (id: string) => erdApi.delete(`/v1/erd/${id}`)
