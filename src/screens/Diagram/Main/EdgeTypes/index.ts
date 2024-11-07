import {DefaultEdgeOptions, EdgeTypes} from "@xyflow/react";
import {FloatingEdge} from "./FloatingEdge"


export const edgeTypes: EdgeTypes = {
  floating: FloatingEdge
}

export const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'floating',
}
