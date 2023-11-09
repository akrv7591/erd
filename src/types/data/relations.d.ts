import {ITable} from "./table";
import {IApiList} from "./util";
import {ITeam} from "./team";

export interface IRelation {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  source: string;
  target: string;

  // Foreign key
  tableId: string;

  // Relations
  table?: ITable
}

