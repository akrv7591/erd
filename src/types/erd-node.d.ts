import {Node} from "reactflow";

export type IColumnType = "primary" | "foreign-key" | "default"
export type ITools = 'grab' | 'add-table' | 'select-all' | 'one-to-one' | 'one-to-many' | 'many-to-many'

export interface IErdNodeColumn {
  id: string;
  name: string;
  primary: boolean;
  type: string;
  foreignKey: boolean;
  selected: boolean;
  null: boolean;
  unique: boolean;
  unsigned: boolean;
  autoIncrement: boolean;
  comment: string;
  order: number;
}

interface IErdNodeData {
  name: string;
  color: string;
  columns: IErdNodeColumn[]
}

interface IErdNode extends Node<IErdNodeData> {}
