import {IErd} from "./erd";
import {IUser} from "./user";

export interface IUserErd {
  createdAt: Date
  updatedAt: Date
  canRead: boolean
  canWrite: boolean
  canDelete: boolean
  isAdmin: boolean

  //Foreign keys
  userId: string
  erdId: string

  //Relations
  user?: IUser
  erd?: IErd
}
