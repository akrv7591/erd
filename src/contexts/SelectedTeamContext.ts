import { UserTeam } from "@/types/log-to/user-team";
import { createContext } from "react";

type SelectedTeamContextType = {
  selectedTeam: null | UserTeam
  setSelectedTeam: (team: null | UserTeam) => void
}

export const SelectedTeamContext = createContext<SelectedTeamContextType>({} as SelectedTeamContextType)
