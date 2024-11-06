import { Axios } from "@/services";
import type {Erd} from "@/types/data/db-model-interfaces";
import type {MutationFunction, QueryFunction} from "@tanstack/react-query";

const { api } = Axios.instance;

const detail: QueryFunction<Erd, [string, string]> = async ({queryKey}) => {
  const [_, erdId] = queryKey

  return api.get<Erd>(`/v1/erds/${erdId}`)
    .then(res => res.data)
}

const listQuery: QueryFunction<Erd[], [string, string]> = async ({queryKey}) => {
  const [_, teamId] = queryKey

  return api.get<Erd[]>("/v1/erds", {
    params: {
      teamId
    }
  })
    .then(res => res.data)
}

const mutation: MutationFunction<Erd, {
  type: "create" | "update" | "delete",
  erd: FormData
}>
  = async ({type, erd}) => {
  switch (type) {
    case "create":
      return api.put<Erd>("/v1/erds", erd)
        .then(res => res.data)
    case "update":
      return api.put<Erd>("/v1/erds", erd)
        .then(res => res.data)
    case "delete":
      return api.delete<Erd>(`/v1/erds/${erd.get("id")}`)
        .then(res => res.data)
  }
}


export const erdApis = {
  detail,
  listQuery,
  mutation
}
