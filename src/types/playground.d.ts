import type {Edge, Node} from "@xyflow/react";
import type {EntityNode, EntityNodeColumn, EntityNodeData} from "@/types/entity-node";
import type {MemoNodeData} from "@/types/memo-node";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";
import {CallbackDataStatus} from "@/enums/playground.ts";

interface ConnectionData {
  relations: Edge[]
  columns: EntityNodeColumn[]
  entities: EntityNode[]
}

interface HighlightedRelation {
  startNodeId: string
  endNodeColumnId: string
}

export type CustomNodeTypes = NODE_TYPES
export type NodeType = Node<EntityNodeData | MemoNodeData, NODE_TYPES>
export type Player = {
  id: string,
  cursorPosition: { x: number, y: number } | null
}

export interface ResponseData<Type, Data> {
  type: Type
  status: CallbackDataStatus
  data: Data
}
