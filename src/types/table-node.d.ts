import type {Node} from "@xyflow/react";
import {IColumn, ITable, IUser} from "@/types/data/db-model-interfaces";

export type ITools = 'hand-grab' | 'add-table' | 'one-to-one' | 'one-to-many' | 'many-to-many'

export interface ITableNodeColumn extends Omit<IColumn, 'createdAt' | 'updatedAt'> {
  selected: boolean;
}

export type CustomNodeTypes = 'tableNode'

export type ITableNodeData = Pick<ITable, 'name' | 'color'> & {
  columns: ITableNodeColumn[]
}

export type ITableNode = Node<ITableNodeData, CustomNodeTypes>

export type NodeType = ITableNode

export interface IPlayer extends IUser {
  cursorPosition: {
    x: number,
    y: number
  }
}
