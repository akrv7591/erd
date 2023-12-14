import {IApiList} from "./util";
import {IUser} from "./user";
import {IUserTeam} from "./user-team";
import {ITeamErd} from "./team-erd";
import {IErd} from "./erd";

interface IUserWithThrough extends IUser{
  UserTeam: IUserTeam
}

interface IErdWithThrough extends IErd {
  TeamErd: ITeamErd
}

export interface ITeam {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string

  // Relations
  users: IUserWithThrough[]
  erds: IErdWithThrough[]
}

export interface IPaginatedTeam extends IApiList<ITeam> {}
