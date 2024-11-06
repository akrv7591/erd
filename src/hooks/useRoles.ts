import { roleApis } from "@/api/logto/role";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useRoles = () => {
  return useSuspenseQuery({
    queryKey: ["roles"],
    queryFn: roleApis.list,
    refetchOnMount: false,
  })
}
