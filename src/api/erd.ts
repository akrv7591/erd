import {IListQuery} from "@/hooks/useListQuery.ts";
import erdApi from "@/api/erdApi.tsx";
import {IApiList} from "@/types/data/util";
import {IErd} from "@/types/data/db-model-interfaces";

export interface IErdWithSelected extends IErd {
}

export const erdListApi = (params: IListQuery) => erdApi.get<IApiList<IErdWithSelected>>("/v1/erd", {params})
  .then(res => res.data)

export const deleteErdApi = (id: string) => erdApi.delete(`/v1/erd/${id}`)
