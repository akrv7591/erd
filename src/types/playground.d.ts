import {Edge, ReactFlowInstance} from "@xyflow/react";
import {EntityNode, EntityNodeColumn} from "@/types/entity-node";
import {MemoNode} from "@/stores/playground/memoStore.ts";

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

export type CustomNodeTypes = 'entityNode' | 'memoNode'
export type NodeType = EntityNode | MemoNode
