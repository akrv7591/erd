import {createFormContext} from "@mantine/form";
import {ITeam, IUser, IUserTeam} from "@/types/data/db-model-interfaces";

export interface IUserWithUserTeam extends Omit<IUser, 'UserTeam'>{
  userTeam: IUserTeam
}

export interface IFormTeam extends Required<Omit<ITeam, 'createdAt' | 'updatedAt' | 'erds' | 'users' | 'UserTeam'>>{
  userTeam: IUserTeam
  selected: boolean
  users: IUserWithUserTeam[]
}

export const [TeamFormProvider, useTeamFormContext, useTeamForm] = createFormContext<IFormTeam>()
