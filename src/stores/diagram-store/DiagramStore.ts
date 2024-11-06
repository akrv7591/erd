import type {ReactFlowInstance} from "@xyflow/react";
import {
  EdgeSlice,
  edgeSlice,
  EntitySlice,
  entitySlice,
  NodeSlice,
  nodeSlice,
  PaneSlice,
  paneSlice,
  socketIoSlice,
  SocketIoSlice,
  UndoRedoSlice,
  undoRedoSlice,
  webrtcSlice,
  WebrtcSlice
} from "./slices";
import {createStore} from "zustand";
import { User } from "@/types/log-to/user";


export type DiagramStore = { reactflow: ReactFlowInstance }
  & PaneSlice
  & NodeSlice
  & EdgeSlice
  & UndoRedoSlice
  & EntitySlice
  & SocketIoSlice
  & WebrtcSlice


export const createDiagramStore = (reactflow: ReactFlowInstance, roomId: string, user: User) => {
  const diagramStore = createStore<DiagramStore>()((...a) => ({
    ...paneSlice(...a),
    ...nodeSlice(...a),
    ...edgeSlice(...a),
    ...undoRedoSlice(...a),
    ...entitySlice(...a),
    ...socketIoSlice(roomId, user.id)(...a),
    ...webrtcSlice(...a),
    reactflow,
    user,
  }))

  return diagramStore
}
