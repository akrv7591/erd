import {IUser} from "./user";
import {IApiList} from "./util";

interface IUserErd extends IUser{
  UserErd: IUserErd
}

export interface IErd {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null;

  //Relations
  users?: IUserErd[]
}

export interface IPaginatedErd extends IApiList<IErd> {}
