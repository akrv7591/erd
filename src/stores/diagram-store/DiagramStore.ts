import {paneStore, PaneStore} from "./stores";
import {ReactFlowInstance} from "@xyflow/react";
import {createStore} from "zustand";
import {useAuthStore, User} from "@/stores/useAuthStore.ts";
import {nodeStore, NodeStore} from "@/stores/diagram-store/stores/node-store";
import {Awareness} from "y-protocols/awareness";
import * as Y from "yjs";

type DiagramStoreState = {
  reactflow: ReactFlowInstance
  awareness: Awareness
  user: User
  undoManager: Y.UndoManager,
  canUndo: boolean,
  canRedo: boolean,
  synced: boolean
}

export type DiagramStore = DiagramStoreState
  & PaneStore
  & NodeStore


export const createDiagramStore = (reactflow: ReactFlowInstance) => {
  const diagramStore = createStore<DiagramStore>()((...a) => ({
    ...paneStore(...a),
    ...nodeStore(...a),
    user: useAuthStore.getState().user,
    reactflow,
    awareness: {} as Awareness,
    undoManager: {} as Y.UndoManager,
    canUndo: false,
    synced: false,
    canRedo: false,
  }))

  return diagramStore
}
