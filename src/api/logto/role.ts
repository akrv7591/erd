import { axiosInstance } from "@/services";
import { Roles } from "@/types/log-to/roles";

const list = async () => {
  return axiosInstance.get<Roles[]>("/v1/roles").then((res) => res.data);
};

export const roleApis = {
  list,
};
