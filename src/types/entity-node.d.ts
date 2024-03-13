import type {Node} from "@xyflow/react";
import {IColumn, ITable, IUser} from "@/types/data/db-model-interfaces";
import {RELATION} from "@/constants/relations.ts";

export type ITools = 'hand-grab' | 'add-table' | RELATION.NAME;


export interface EntityNodeColumn extends Omit<IColumn, 'createdAt' | 'updatedAt'> {
  selected: boolean;
}

export type CustomNodeTypes = 'tableNode'

export type EntityNodeData = Pick<ITable, 'name' | 'color'> & {
  columns: EntityNodeColumn[]
}

export type EntityNode = Node<EntityNodeData, CustomNodeTypes>

export type NodeType = EntityNode

export interface LivePlayer extends IUser {
  cursorPosition: {
    x: number,
    y: number
  }
}
