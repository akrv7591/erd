import { userApis } from "@/api/user";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useUser = () => {
  return useSuspenseQuery({
    queryKey: ["me"],
    queryFn: userApis.meApi,
    refetchOnMount: false,
  })
}
