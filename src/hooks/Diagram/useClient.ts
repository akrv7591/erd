import {useQuery} from "@tanstack/react-query"
import {userWithProfileApi} from "@/api/user.ts";

export const useClient = (userId: string) => {
  return  useQuery({
    retry: false,
    queryKey: [userId],
    queryFn: userWithProfileApi

  })
}
