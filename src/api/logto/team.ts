import {MutationFunction, QueryFunction} from "@tanstack/react-query";
import {TeamUser} from "@/types/log-to/team-user.ts";
import {TeamInvitationRequestBody, TeamInvitationResponse} from "@/types/log-to/team-invitation.ts";
import erdApi from "@/api/erdApi.ts";
import {TeamResponse} from "@/types/log-to/team.ts";
import {UserTeam} from "@/types/log-to/user-team.ts";

export class TeamApi {
  static teamMutation: MutationFunction<UserTeam, {type: "create" | "update" | "delete", team: UserTeam}> = ({type, team}) => {
    switch (type) {
    case "create":
      return erdApi.post<UserTeam>("/v1/teams", team)
        .then(res => res.data)
    case "update":
      return erdApi.patch<UserTeam>(`/v1/teams/${team.id}`, team)
        .then(res => res.data)
    case "delete":
      return erdApi.delete<UserTeam>(`/v1/teams/${team.id}`)
        .then(res => res.data)
    }
  }
}

const teamUserListApi: QueryFunction<TeamUser[], [string]> = async ({queryKey}) => {
  const [teamId] = queryKey

  if (!teamId) {
    return []
  }

  return erdApi.get<TeamUser[]>(`/v1/teams/${teamId}/users`).then(res => res.data)
}

const teamInvitationListApi: QueryFunction<TeamInvitationResponse[], [string, string]> = async ({queryKey}) => {
  const [_, teamId] = queryKey

  return erdApi.get<TeamInvitationResponse[]>(`/v1/team-invitations`, {params: {teamId}}).then(res => res.data)
}

const teamInvitationJoinApi: MutationFunction<TeamResponse, string> = async (invitationId) => {
  return erdApi.post<TeamResponse>(`/v1/team-invitations/${invitationId}/join`).then(res => res.data)
}

const teamInviteUserApi: MutationFunction<{}, TeamInvitationRequestBody> = async (invitationData) => {
  return erdApi.post<TeamUser>(`/v1/team-invitations`, invitationData).then(res => res.data)
}

const deleteUserFromTeamApi: MutationFunction<any, {teamId: string, userId: string}> = async ({teamId, userId}) => {
  return erdApi.delete(`/v1/teams/${teamId}/users/${userId}`)
}

const updateTeamUserRoleApi: MutationFunction<any, {teamId: string, userId: string, roleId: string}> = async ({teamId, userId, roleId}) => {
  return erdApi.put(`/v1/teams/${teamId}/users/${userId}/role`, {roleId})
}

export {
  teamUserListApi,
  teamInvitationListApi,
  teamInvitationJoinApi,
  teamInviteUserApi,
  deleteUserFromTeamApi,
  updateTeamUserRoleApi
}
