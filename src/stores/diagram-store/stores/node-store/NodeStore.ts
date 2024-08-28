import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store/DiagramStore.ts";
import {applyNodeChanges, NodeChange} from "@xyflow/react";
import {NodeType} from "@/providers/shared-diagram-store-provider/type.ts";

interface NodeStoreState {
  nodes: NodeType[]
}

interface NodeStoreAction {
  handleNodeChanges: (nodeChanges: NodeChange<NodeType>[]) => void
}

export type NodeStore = NodeStoreState & NodeStoreAction

const initialStore: NodeStoreState = {
  nodes: []
}

export const nodeStore: StateCreator<DiagramStore, [], [], NodeStore> = ((set) => ({
  ...initialStore,

  // Actions
  handleNodeChanges: (nodeChanges) => {
    set((state) => ({nodes: applyNodeChanges<NodeType>(nodeChanges, state.nodes)}))
  },
}))
