import {DefaultEdgeOptions, EdgeTypes} from "@xyflow/react";
import {FloatingEdge} from "./FloatingEdge"

export enum EDGE_TYPES {
  ENTITY = "entity",
}

export const edgeTypes: EdgeTypes = {
  [EDGE_TYPES.ENTITY]: FloatingEdge
}

export const defaultEdgeOptions: DefaultEdgeOptions = {
  type: EDGE_TYPES.ENTITY,
}
