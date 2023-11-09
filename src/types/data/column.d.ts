import {ITable} from "./table";

export interface IColumn {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  primary: boolean;
  type: string;
  foreignKey: boolean;
  null: boolean;
  unique: boolean;
  unsigned: boolean;
  autoIncrement: boolean;
  comment: string;

  // Foreign key
  tableId: string;

  // Relations
  table?: ITable
}
