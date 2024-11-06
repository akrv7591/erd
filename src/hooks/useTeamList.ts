import { userTeamListApi } from "@/api/logto/user"
import { useSuspenseQuery } from "@tanstack/react-query"

export const useTeamList = () => {
  return useSuspenseQuery({
    queryKey: ['user-teams'],
    queryFn: userTeamListApi,
    refetchOnMount: false
  })
}
