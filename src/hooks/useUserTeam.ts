import {useContext} from "react";
import {UserTeamContext} from "@/contexts/UserTeamContext";

export const useUserTeam = () => {
  const userTeam = useContext(UserTeamContext)

  if (Object.keys(userTeam).length === 0) {
    throw new Error("useUserTeam must be used within a UserTeamProvider")
  }

  return userTeam
}
