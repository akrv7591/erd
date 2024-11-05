import erdApi from "@/api/erdApi.ts";
import type {Erd} from "@/types/data/db-model-interfaces.ts";
import type {MutationFunction, QueryFunction} from "@tanstack/react-query";

const detail: QueryFunction<Erd, [string, string]> = async ({queryKey}) => {
  const [_, erdId] = queryKey

  return erdApi.get<Erd>(`/v1/erds/${erdId}`)
    .then(res => res.data)
}

const listQuery: QueryFunction<Erd[], [string, string]> = async ({queryKey}) => {
  const [_, teamId] = queryKey

  return erdApi.get<Erd[]>("/v1/erds", {
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
      return erdApi.put<Erd>("/v1/erds", erd)
        .then(res => res.data)
    case "update":
      return erdApi.put<Erd>("/v1/erds", erd)
        .then(res => res.data)
    case "delete":
      return erdApi.delete<Erd>(`/v1/erds/${erd.get("id")}`)
        .then(res => res.data)
  }
}


export const erdApis = {
  detail,
  listQuery,
  mutation
}
