import {JWTPayload} from "jose";
import {IApiList} from "./util";
import {IUserTeam} from "./user-team";
import {ITeam} from "./team";
import {IErd} from "./erd";
import {IUserErd} from "./user-erd";

export interface IAuthorizationUser extends JWTPayload{
  id: string
  name: string
  email: string
  emailVerified: null | string
  createdAt: string
  updatedAt: string
}

export interface IUser {
  id: string
  name: string
  email: string
  emailVerified: null | string
  createdAt: string
  updatedAt: string

  //Relations
  teams: ITeamWithThrough[]
  erds: IErdWithThrough[]
}

interface ITeamWithThrough extends ITeam{
  UserTeam: IUserTeam
}

interface IErdWithThrough extends IErd {
  UserErd: IUserErd
}

export interface IPaginatedUser extends IApiList<IUser> {}
