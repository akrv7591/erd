import erdApi from "@/api/erdApi.ts";
import {IErd} from "@/types/data/db-model-interfaces.ts";
import {MutationFunction, QueryFunction} from "@tanstack/react-query";

export class ErdApi {
  static listQuery: QueryFunction<IErd[], [string, string]> = async ({queryKey}) => {
    const [_, teamId] = queryKey

    return erdApi.get<IErd[]>("/v1/erds", {
      params: {
        teamId
      }
    })
      .then(res => res.data)
  }

  static mutation: MutationFunction<IErd, {
    type: "create" | "update" | "delete",
    erd: FormData
  }>
    = async ({type, erd}) => {
    switch (type) {
      case "create":
        return erdApi.put<IErd>("/v1/erds", erd)
          .then(res => res.data)
      case "update":
        return erdApi.put<IErd>("/v1/erds", erd)
          .then(res => res.data)
      case "delete":
        return erdApi.delete<IErd>(`/v1/erds/${erd.get("id")}`)
          .then(res => res.data)
    }
  }
}
