import {paneStore, PaneStore} from "./stores";
import {ReactFlowInstance} from "@xyflow/react";
import {createStore} from "zustand";
import {nodeStore, NodeStore} from "@/stores/diagram-store/stores/node-store";
import {Awareness} from "y-protocols/awareness";
import * as Y from "yjs";
import {useLogToAuthStore} from "@/stores/useLogToAuthStore.ts";
import {LOG_TO} from "@/types/log-to.ts";

type DiagramStoreState = {
  reactflow: ReactFlowInstance
  awareness: Awareness
  user: LOG_TO.UserInfo
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
    user: useLogToAuthStore.getState().user!,
    reactflow,
    awareness: {} as Awareness,
    undoManager: {} as Y.UndoManager,
    canUndo: false,
    synced: false,
    canRedo: false,
  }))

  return diagramStore
}
