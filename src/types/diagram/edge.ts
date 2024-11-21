import { RELATION } from "@/namespaces"
import { EDGE_TYPES } from "@/screens/Diagram/Main/EdgeTypes"
import { Edge } from "@xyflow/react"

export type EntityEdgeData = {
  foreignKeyColumns: {
    sourceColumnId: string,
    targetColumnId: string
  }[],
  relationName: RELATION.NAME
}

export type EntityEdge = Edge<EntityEdgeData, EDGE_TYPES.ENTITY>

export type EdgeType = EntityEdge
