import {EdgeChange, NodeChange} from "@xyflow/react";
import {NodeType} from "@/types/diagram";

export namespace REACTFLOW {
  export enum TYPE {
    NODE_CHANGE = "reactflow:node-changes",
    EDGE_CHANGE = "reactflow:edge-changes",
  }

  export type NODE_CHANGE = {
    type: TYPE.NODE_CHANGE;
    value: NodeChange<NodeType>[]
    server: boolean
  }

  export type EDGE_CHANGE = {
    type: TYPE.EDGE_CHANGE
    value: EdgeChange
    server: boolean
  }

  export type DATA = NODE_CHANGE | EDGE_CHANGE
}
