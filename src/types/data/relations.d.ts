import {ITable} from "./table";
import {Edge} from "reactflow";

export interface IRelation extends Edge{
  id: string;
  source: string;
  target: string;
  createdAt: string;
  markerEnd: string;

  // Foreign key
  erdId: string;

  // Relations
  erd?: ITable
}

export interface ICRelation {
  id: string;
  source: string;
  target: string;
  createdAt?: string;
  markerEnd: string;

  // Foreign key
  erdId?: string;
}

