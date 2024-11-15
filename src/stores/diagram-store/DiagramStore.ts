import type {ReactFlowInstance} from "@xyflow/react";
import {
  edgeSlice,
  entitySlice,
  nodeSlice,
  paneSlice,
  socketIoSlice,
  undoRedoSlice,
  // webrtcSlice,
  type EdgeSlice,
  type EntitySlice,
  type NodeSlice,
  type PaneSlice,
  type SocketIoSlice,
  type UndoRedoSlice,
  // type WebrtcSlice
} from "./slices";
import {createStore} from "zustand";
import type { User } from "@/types/log-to/user";

export type DiagramStore = {
  reactflow: ReactFlowInstance
}
  & PaneSlice
  & NodeSlice
  & EdgeSlice
  & UndoRedoSlice
  & EntitySlice
  & SocketIoSlice
  // & WebrtcSlice

type CreateDiagramArgs = {
  reactflow: ReactFlowInstance,
  roomId: string,
  user: User,
  peerId: string
}

export const createDiagramStore = ({ reactflow, roomId, user, peerId }: CreateDiagramArgs) => {
  const diagramStore = createStore<DiagramStore>()((...a) => ({
    ...paneSlice(user, reactflow)(...a),
    ...nodeSlice(...a),
    ...edgeSlice(...a),
    ...undoRedoSlice(...a),
    ...entitySlice(...a),
    ...socketIoSlice(roomId, user.id, peerId)(...a),
    // ...webrtcSlice(peerId)(...a),
  }))

  return diagramStore
}
