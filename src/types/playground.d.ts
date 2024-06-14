import type {Node} from "@xyflow/react";
import type {EntityNode, EntityNodeColumn, EntityNodeData} from "@/types/entity-node";
import type {MemoNodeData} from "@/types/memo-node";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";
import {CallbackDataStatus} from "@/enums/playground.ts";
import {ICRelation} from "@/types/data/db-model-interfaces";

interface ConnectionData {
  relations: ICRelation[]
  columns: EntityNodeColumn[]
  entities: EntityNode[]
}

interface HighlightedRelation {
  startNodeId: string
  endNodeColumnId: string
}

export type CustomNodeTypes = NODE_TYPES
export type NodeType = Node<EntityNodeData, NODE_TYPES.ENTITY> | Node<MemoNodeData, NODE_TYPES.MEMO> | Node
export type Player = {
  id: string,
  cursorPosition: { x: number, y: number } | null
}

export interface ResponseData<Type, Data> {
  type: Type
  status: CallbackDataStatus
  data: Data
}
