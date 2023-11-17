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
  order: number

  // Foreign key
  tableId: string;

  // Relations
  table?: ITable
}

export interface ICColumn {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  primary: boolean;
  type: string;
  foreignKey: boolean;
  null: boolean;
  unique: boolean;
  unsigned: boolean;
  autoIncrement: boolean;
  comment: string;
  order: number

  // Foreign key
  tableId?: string;

  // Relations
  table?: ITable
}
