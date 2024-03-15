import type {Node} from "@xyflow/react";
import {IColumn, IEntity, IUser} from "@/types/data/db-model-interfaces";
import {RELATION} from "@/constants/relations.ts";
import {CustomNodeTypes} from "@/types/playground";

export type ITools = 'hand-grab' | 'add-table' | 'add-memo' | RELATION.NAME;


export interface EntityNodeColumn extends Omit<IColumn, 'createdAt' | 'updatedAt'> {
  selected: boolean;
}

export type EntityNodeData = Pick<IEntity, 'name' | 'color'> & {
  columns: EntityNodeColumn[]
}

export type EntityNode = Node<EntityNodeData, CustomNodeTypes>

export interface LivePlayer extends IUser {
  cursorPosition: {
    x: number,
    y: number
  }
}
