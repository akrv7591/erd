import {createContext, useContext} from "react";
import {UserTeam} from "@/types/log-to/user-team.ts";

type UserTeamContextType = {
  isOwner: boolean,
  isAdmin: boolean,
  canEditTeam: boolean,
  team: UserTeam,
}

export const UserTeamContext = createContext<UserTeamContextType>({} as UserTeamContextType)

export const useUserTeam = () => {
  const userTeam = useContext(UserTeamContext)

  if (Object.keys(userTeam).length === 0) {
    throw new Error("useUserTeam must be used within a UserTeamProvider")
  }

  return userTeam
}

