import { StateCreator } from "zustand";
import { DiagramStore } from "@/stores/diagram-store/DiagramStore";
import { ReactFlowInstance } from "@xyflow/react";
import { NodeType } from "@/types/diagram";
import { EdgeType } from "@/types/diagram/edge";
import { BROADCAST } from "@/namespaces";

interface DiagramSliceState {
  reactflow: ReactFlowInstance;
}

interface DiagramSliceAction {
  requestNodesEdgesDelete: (
    nodes: NodeType[],
    edges: EdgeType[],
  ) => Promise<boolean>;
  handleDataChange: (data: {
    updates: BROADCAST.DATA[];
    current: BROADCAST.DATA[];
  }) => void;
}

export type DiagramSlice = DiagramSliceState & DiagramSliceAction;
type SliceCreator = (
  reactflow: ReactFlowInstance,
) => StateCreator<DiagramStore, [], [], DiagramSlice>;

export const diagramSlice: SliceCreator = (reactflow) => (set, get, api) => ({
  reactflow,
  requestNodesEdgesDelete: (nodes, edges) =>
    new Promise((resolve) => {
      set((state) => {
        return {
          confirmModal: {
            ...state.confirmModal,
            opened: true,
            message: "Are you sure to delete all selected nodes and relations",
            onConfirm: (callback) => {
              resolve(true);
              callback?.();
            },
            onCancel: (callback) => {
              resolve(false);
              callback?.();
            },
          },
        };
      });
    }),
  handleDataChange: ({ current, updates }) => {
    const { socket, applyDataChanges, pushUndo } = api.getState();
    socket.broadcastData(updates);
    applyDataChanges(updates);
    pushUndo({
      undo: current,
      redo: updates,
    });
  },
});
