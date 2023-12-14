import {IUser} from "./user";
import {IApiList} from "./util";
import {ITable} from "./table";
import {IRelation} from "./relations";
import {ITeam} from "./team";
import {IUserErd} from "./user-erd";
import {ITeamErd} from "./team-erd";

interface IUserWithThrough extends Partial<IUser>{
  UserErd: Partial<IUserErd>
}

interface ITeamWithThrough extends Partial<ITeam>{
  TeamErd: Partial<ITeamErd>
}

export interface IErd {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null;
  isPublic: boolean;

  //Relations
  users?: IUserWithThrough[]
  teams?: ITeamWithThrough[]
  userErds?: IUserErd[]
  tables: ITable[]
  relations: IRelation[]
}

export interface IPaginatedErd extends IApiList<IErd> {}
