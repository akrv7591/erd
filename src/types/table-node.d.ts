import type {Node} from "@xyflow/react";
import {IColumn, ITable, IUser} from "@/types/data/db-model-interfaces";

export type ITools = 'hand-grab' | 'add-table' | 'one-to-one' | 'one-to-many' | 'many-to-many'

export interface ITableNodeColumn extends Omit<IColumn, 'createdAt' | 'updatedAt'> {
  selected: boolean;
}

export interface ITableNodeData extends Pick<ITable, 'name' | 'color'>{
  columns: ITableNodeColumn[]
}

export interface ITableNode extends Node<ITableNodeData> {
  updatedAt?: Date
}

export interface IPlayer extends IUser {
  cursorPosition: {
    x: number,
    y: number
  }
}
