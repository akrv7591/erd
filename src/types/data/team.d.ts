import {IApiList} from "./util";
import {IUser} from "./user";
import {IUserTeam} from "./user-team";

interface ITeamUser extends IUser{
  UserTeam: IUserTeam
}

export interface ITeam {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string

  // Relations
  users: ITeamUser[]
}

export interface IPaginatedTeam extends IApiList<ITeam> {}
