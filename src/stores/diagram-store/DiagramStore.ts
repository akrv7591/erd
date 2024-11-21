import type {ReactFlowInstance} from "@xyflow/react";
import {
  edgeSlice,
  entitySlice,
  nodeSlice,
  paneSlice,
  socketIoSlice,
  undoRedoSlice,
  diagramSlice,
  type EdgeSlice,
  type EntitySlice,
  type NodeSlice,
  type PaneSlice,
  type SocketIoSlice,
  type UndoRedoSlice,
  type DiagramSlice,
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
  & DiagramSlice

type CreateDiagramArgs = {
  reactflow: ReactFlowInstance,
  roomId: string,
  user: User,
}

export const createDiagramStore = ({ reactflow, roomId, user }: CreateDiagramArgs) => {
  const diagramStore = createStore<DiagramStore>()((...a) => ({
    ...paneSlice(user)(...a),
    ...nodeSlice(...a),
    ...edgeSlice(...a),
    ...undoRedoSlice(...a),
    ...entitySlice(...a),
    ...socketIoSlice(roomId, user.id)(...a),
    ...diagramSlice(reactflow)(...a)
  }))

  return diagramStore
}
