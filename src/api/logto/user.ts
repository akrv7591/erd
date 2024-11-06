import { QueryFunction } from "@tanstack/react-query";
import { UserTeam } from "@/types/log-to/user-team";
import { Axios } from "@/services";

const { api } = Axios.instance;

const userTeamListApi: QueryFunction<UserTeam[], [string]> = async () => {
  return api
    .get<UserTeam[]>(`/v1/users/teams`)
    .then((response) => {
      return response.data;
    });
};

export { userTeamListApi };
