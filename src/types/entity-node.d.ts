import type {Node} from "@xyflow/react";
import type {IColumn, IEntity} from "@/types/data/db-model-interfaces";
import {RELATION} from "@/constants/relations.ts";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";

export type ITools = 'hand-grab' | 'add-table' | 'add-memo' | RELATION.NAME;


export interface EntityNodeColumn extends Omit<IColumn, 'createdAt' | 'updatedAt'> {
  selected: boolean;
}

export type EntityNodeData = Pick<IEntity, 'name' | 'color'> & {
  columns: EntityNodeColumn[]
}

export type EntityNode = Node<EntityNodeData, NODE_TYPES.ENTITY>

export type ColumnUpdatePayload = {
  entityId: string,
  key: string,
  value: any,
  id: string
}
