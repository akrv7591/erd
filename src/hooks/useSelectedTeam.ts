import { SelectedTeamContext } from "@/contexts/SelectedTeamContext"
import { useContext } from "react"

export const useSelectedTeam = () => {
  const context = useContext(SelectedTeamContext)

  if (!context) {
    throw new Error("useTeam hook should be in childeren of TeamContext.Provider")
  }

  return context
}
