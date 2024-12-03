import {DefaultEdgeOptions, EdgeTypes} from "@xyflow/react";
import {SmartEdge} from "@/screens/Diagram/Main/EdgeTypes/SmartEdge";


export enum EDGE_TYPES {
  ENTITY = "entity",
}

export const edgeTypes: EdgeTypes = {
  [EDGE_TYPES.ENTITY]: SmartEdge
}

export const defaultEdgeOptions: DefaultEdgeOptions = {
  type: EDGE_TYPES.ENTITY,
}
