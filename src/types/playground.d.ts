import type {Edge, ReactFlowInstance} from "@xyflow/react";
import type {EntityNode, EntityNodeColumn} from "@/types/entity-node";
import type {MemoNode} from "@/types/memo-node";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";

interface AddNodeProps {
  reactFlowInstance: ReactFlowInstance
}

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
export type NodeType = EntityNode | MemoNode
