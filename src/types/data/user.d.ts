import {JWTPayload} from "jose";
import {IApiList} from "./util";
import {IUserTeam} from "./user-team";
import {ITeam} from "./team";

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
  teams: IUserTeam[]
}

interface IUserTeam extends ITeam{
  UserTeam: IUserTeam
}

export interface IPaginatedUser extends IApiList<IUser> {}
