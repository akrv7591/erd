import {IColumn} from "./column";
import {IErd} from "./erd";
import {XYPosition, Node} from "reactflow";

export interface ITable extends Node{
  id: string;
  createdAt: string;
  updatedAt: string;

  name: string;
  color: string;
  position: XYPosition;
  type: string;

  data: any;

  // Foreign key
  erdId: string;

  // Relations
  erd?: IErd
  columns?: IColumn[]
}
