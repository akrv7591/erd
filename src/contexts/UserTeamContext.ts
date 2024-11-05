import {createContext} from "react";
import {UserTeam} from "@/types/log-to/user-team.ts";

type UserTeamContextType = {
  isOwner: boolean,
  isAdmin: boolean,
  canEditTeam: boolean,
  team: UserTeam,
}

export const UserTeamContext = createContext<UserTeamContextType>({} as UserTeamContextType)
