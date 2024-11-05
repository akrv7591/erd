import {EdgeChange, NodeChange, XYPosition} from "@xyflow/react";
import {NodeType} from "@/types/diagram/index.ts";
import {BROADCAST} from "@/namespaces";

type ReactflowNodeChange = {
  type: BROADCAST.DATA.TYPE.REACTFLOW_NODE_CHANGE;
  server?: boolean
  value: NodeChange<NodeType>[];
}

type NodeDataUpdate = {
  server?: boolean
  type: BROADCAST.DATA.TYPE.NODE_DATA_UPDATE;
  value: { id: string; data: NodeType["data"] };
}

type ClientCursorChange = {
  type: BROADCAST.DATA.TYPE.CLIENT_CURSOR_CHANGE;
  server?: boolean
  value: {
    peerId: string;
    cursor: XYPosition | null;
  };
}

type ReactflowEdgeChange = {
  type: BROADCAST.DATA.TYPE.REACTFLOW_EDGE_CHANGE;
  server?: boolean
  value: EdgeChange[];
}

export type DataBroadcast =
  | NodeDataUpdate
  | ReactflowNodeChange
  | ReactflowEdgeChange
  | ClientCursorChange
