import {QueryFunction} from "@tanstack/react-query";
import {StaticFile} from "@/types/data/db-model-interfaces";
import { axiosInstance } from "@/services";


const detail: QueryFunction<StaticFile, [string, string]> = async ({queryKey}) => {
  const [_, staticFileId] = queryKey
  return axiosInstance.get(`/v1/static-files/${staticFileId}`).then(res => res.data)
}

export const staticFileApis = {
  detail
}
