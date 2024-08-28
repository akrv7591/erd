import {paneStore, PaneStore} from "./stores";
import {ReactFlowInstance} from "@xyflow/react";
import {createStore} from "zustand";
import {useAuthStore, User} from "@/stores/useAuthStore.ts";
import {nodeStore, NodeStore} from "@/stores/diagram-store/stores/node-store";
import {Awareness} from "y-protocols/awareness";

type DiagramStoreState = {
  reactflow: ReactFlowInstance
  awareness: Awareness
  user: User
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
    synced: false
  }))

  return diagramStore
}
