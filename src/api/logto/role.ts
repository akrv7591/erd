import { Axios } from "@/services";
import { Roles } from "@/types/log-to/roles";

const { api } = Axios.instance;

const list = async () => {
  return api.get<Roles[]>("/v1/roles").then((res) => res.data);
};

export const roleApis = {
  list,
};
