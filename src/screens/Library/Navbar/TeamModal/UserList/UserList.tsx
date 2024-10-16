import {InputLabel, Stack} from "@mantine/core";
import {UserWithRole} from "./UserWithRole";
import {memo} from "react";
import {useQuery} from "@tanstack/react-query";
import {teamInvitationListApi, teamUserListApi} from "@/api/logto/team.ts";
import {useUserTeam} from "@/contexts/UserTeamContext.ts";
import {InvitedUser} from "./InvitedUser";
import {InviteUser} from "./InviteUser";

export const UserList = memo(() => {
  const {team} = useUserTeam()
  const {data: users = []} = useQuery({
    queryKey: [team.id],
    queryFn: teamUserListApi
  })
  const {data: invitedUsers = [], refetch: refetchInvited} = useQuery({
    queryKey: ["invited-users", team.id],
    queryFn: teamInvitationListApi
  })

  return (
    <Stack>
      <InputLabel>Users</InputLabel>
      <Stack mah={"300px"} style={{overflow: "scroll"}} gap={"5px"}>
        {users.map((user) => (
          <UserWithRole key={user.id} user={user} />
        ))}

        {invitedUsers.length > 0 && (
          <>
            <InputLabel>Invited users</InputLabel>
            {invitedUsers.map((invitedUser) => (
              <InvitedUser key={invitedUser.id} user={invitedUser}/>
            ))}
          </>
        )}
      </Stack>
      <InviteUser onSuccessfulInvite={refetchInvited}/>
    </Stack>
  )
})
