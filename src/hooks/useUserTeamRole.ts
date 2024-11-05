import {useUser} from "@/hooks";
import {useMemo} from "react";
import {Roles} from "@/types/log-to/roles.ts";

export const useUserTeamRole = (teamId: string) => {
  const user = useUser()

  return  useMemo(() => {
    const teamRole = user.organizationRoles.find(organizationRole => organizationRole.includes(teamId))

    if (!teamRole) {
      throw new Error("Team list api is used wrong")
    }

    return teamRole.split(":")[1] as Roles['name']

  }, [user.organizationRoles, teamId])
}
