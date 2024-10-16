import erdApi from "@/api/erdApi.ts";
import {Roles} from "@/types/log-to/roles.ts";

const list = async () => {
  return erdApi.get<Roles[]>("/v1/roles").then(res => res.data)
}

export const roleApis = {
  list
}
