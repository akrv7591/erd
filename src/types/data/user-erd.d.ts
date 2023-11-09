import {IErd} from "./erd";
import {IUser} from "./user";

export interface IUserErd {
  id: string
  createdAt: Date
  updatedAt: Date
  isAdmin: boolean
  canEdit: boolean

  //Foreign keys
  userId: string
  erdId: string

  //Relations
  user?: IUser
  erd?: IErd
}
