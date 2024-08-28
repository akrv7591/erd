import type {Edge} from "@xyflow/react";
import type {EntityNode, EntityNodeColumn} from "@/types/entity-node.ts";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";

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
export type Client = {
  id: number,
  userId: string,
  cursor: { x: number, y: number } | null
  color: string
}

