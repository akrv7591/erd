import {QueryFunction} from "@tanstack/react-query";
import {UserTeam} from "@/types/log-to/user-team.ts";
import erdApi from "@/api/erdApi.ts";
import {useLibraryStore} from "@/stores/useLibrary.ts";
import {useLogToAuthStore} from "@/stores/useLogToAuthStore.ts";

const userTeamListApi: QueryFunction<UserTeam[], [string]> = async () => {
  return erdApi.get<UserTeam[]>(`/v1/users/teams`,)
    .then(res => {
      const userId = useLogToAuthStore.getState().user?.sub
      const index = res.data.findIndex(team => {
        return team.customData.isPersonal && team.customData.owner === userId
      })

      if (index !== -1) {
        const personalTeam = res.data.splice(index, 1)
        if (personalTeam.length > 0) {
          const personal = personalTeam[0]

          useLibraryStore.setState(state => state.initialized ? ({
            personal,
            isPersonal: state.team?.id === personal?.id,
            teamList: [personal, ...res.data]
          }) : ({
            personal,
            team: personal,
            isPersonal: true,
            teamList: [personal, ...res.data],
            initialized: true
          }))
        }
      }

      return res.data
    })
}

export {
  userTeamListApi
}
