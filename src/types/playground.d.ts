import {Edge, ReactFlowInstance} from "@xyflow/react";
import {EntityNode, EntityNodeColumn} from "@/types/entity-node";
import {MemoNode} from "@/stores/playground/memoStore.ts";
import {NODE_TYPES} from "@/screens/Playground/Main/nodes";

interface IAddNodeProps {
  reactFlowInstance: ReactFlowInstance
}

interface IConnectionData {
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
