import {FC, memo, PropsWithChildren, useMemo} from "react";
import {UserTeam} from "@/types/log-to/user-team";
import {UserTeamContext} from "@/contexts/UserTeamContext";

type Props = {
  userTeam: UserTeam
}

export const UserTeamProvider: FC<PropsWithChildren<Props>> = memo(({children, userTeam: team}) => {
  const isOwner = useMemo(() => team.organizationRoles.some(role => role.name === "owner"), [team])
  const isAdmin = useMemo(() => team.organizationRoles.some(role => role.name === "admin"), [team])
  const canEditTeam = useMemo(() => isOwner || isAdmin, [isOwner, isAdmin])

  return (
    <UserTeamContext.Provider value={{
      team,
      isOwner,
      isAdmin,
      canEditTeam,
    }}>
      {children}
    </UserTeamContext.Provider>
  )
})
