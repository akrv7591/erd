import { StateCreator } from "zustand";
import { DiagramStore } from "@/stores/diagram-store/DiagramStore";
import { applyEdgeChanges, EdgeChange } from "@xyflow/react";
import {REACTFLOW} from "@/namespaces/broadcast/reactflow";
import { EdgeType } from "@/types/diagram/edge";

interface EdgeSliceState {
  edges: EdgeType[];
}

interface EdgeSliceAction {
  handleEdgesChange: (changes: EdgeChange<EdgeType>[]) => void
  requestEdgesDelete: (edges: EdgeType[]) => Promise<boolean>
}

export type EdgeSlice = EdgeSliceState & EdgeSliceAction;

const initialStore: EdgeSliceState = {
  edges: [],
};

export const edgeSlice: StateCreator<DiagramStore, [], [], EdgeSlice> = (
  set,
) => ({
  ...initialStore,


  // Actions
  handleEdgesChange: (edgeChanges) => {
    set((state) => {
      const changesToBroadcast: EdgeChange<EdgeType>[] = edgeChanges.filter(edge => ["remove", "select"].includes(edge.type))

      if (changesToBroadcast.length > 0) {
        state.socket.broadcastData([
          {
            type: REACTFLOW.TYPE.EDGE_CHANGE,
            value: changesToBroadcast,
          },
        ]);
      }

      return {
        edges: applyEdgeChanges(edgeChanges, state.edges),
      };
    });
  },

  requestEdgesDelete: (edges) => new Promise((resolve) => {
    set(state => {
      const message = edges.length
        ? "Are you sure to delete all selected relations"
        : "Are you sure to delete selected relation";
      return {
        confirmModal: {
          ...state.confirmModal,
          opened: true,
          message,
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
    })
  })
});
