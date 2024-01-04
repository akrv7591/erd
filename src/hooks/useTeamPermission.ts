import {useLibraryStore} from "@/stores/useLibrary.ts";

export const useTeamPermission = (teamId: string) => {
  const teams = useLibraryStore(state => state.teams)

  return teams.find(team => team.id === teamId)?.UserTeam
}
