import { QueryFunction } from "@tanstack/react-query";
import { UserTeam } from "@/types/log-to/user-team";
import { axiosInstance } from "@/services";

const userTeamListApi: QueryFunction<UserTeam[], [string]> = async () => {
  return axiosInstance
    .get<UserTeam[]>(`/v1/users/teams`)
    .then((response) => {
      return response.data;
    });
};

export { userTeamListApi };
