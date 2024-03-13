import {Edge, ReactFlowInstance} from "@xyflow/react";
import {EntityNode, EntityNodeColumn} from "@/types/entity-node";

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
