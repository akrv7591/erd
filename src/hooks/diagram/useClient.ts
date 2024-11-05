import {useQuery} from "@tanstack/react-query"
import {userApis} from "@/api/user.ts";

export const useClient = (userId: string) => {
  return useQuery({
    retry: false,
    queryKey: [userId],
    queryFn: userApis.userWithProfileApi
  })
}
