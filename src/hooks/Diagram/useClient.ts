import {useQuery} from "@tanstack/react-query"
import erdApi from "@/api/erdApi.tsx";
import {IUser} from "@/types/data/db-model-interfaces.ts";

export const useClient = (userId: string) => {
  return  useQuery({
    retry: false,
    queryKey: [userId],
    queryFn: () => erdApi.get<IUser>(`/v1/users/${userId}`).then(res => res.data)
  })
}
