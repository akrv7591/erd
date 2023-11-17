import {ITable} from "./table";

export interface IRelation {
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

