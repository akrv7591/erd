import {Node} from "reactflow";

export type IColumnType = "primary" | "foreign-key" | "default"
export type ITools = 'grab' | 'add-table' | 'select-all' | 'one-to-one' | 'one-to-many' | 'many-to-many'

export interface IErdNodeColumn {
  id: string;
  column: string;
  primary: boolean;
  dataType: string;
  foreignKey: boolean;
  selected: boolean;
  notNull: boolean;
  unique: boolean;
  unsigned: boolean;
  autoIncrement: boolean;
  comment: string;
}

interface IErdNodeData {
  tableName: string;
  color: string;
  columns: IErdNodeColumn[]
}

interface IErdNode extends Node<IErdNodeData> {}
