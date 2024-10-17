import {QueryFunction} from "@tanstack/react-query";
import erdApi from "@/api/erdApi.ts";

const detail: QueryFunction<any, [string, string]> = async ({queryKey}) => {
  const [_, staticFileId] = queryKey
  return erdApi.get(`/v1/static-files/${staticFileId}`).then(res => res.data)
}

export const staticFileApis = {
  detail
}
