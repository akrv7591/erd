import erdApi from "@/api/erdApi";
import {Roles} from "@/types/log-to/roles";

const list = async () => {
  return erdApi.get<Roles[]>("/v1/roles").then(res => res.data)
}

export const roleApis = {
  list
}
