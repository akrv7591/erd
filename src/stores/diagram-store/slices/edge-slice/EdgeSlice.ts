import { StateCreator } from "zustand";
import { DiagramStore } from "@/stores/diagram-store/DiagramStore";
import { applyEdgeChanges, Edge, EdgeChange } from "@xyflow/react";
import {REACTFLOW} from "@/namespaces/broadcast/reactflow";

interface EdgeSliceState {
  edges: Edge[];
}

interface EdgeSliceAction {
  handleEdgesChange: (changes: EdgeChange[]) => void
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
      const changesToBroadcast: EdgeChange[] = [];

      edgeChanges.forEach((edgeChange) => {
        switch (edgeChange.type) {
          case "remove":
            changesToBroadcast.push(edgeChange);
            break;
        }
      });

      if (changesToBroadcast.length > 0) {
        state.socket.broadcastData([
          {
            type: REACTFLOW.TYPE.EDGE_CHANGE,
            value: changesToBroadcast,
            server: true,
          },
        ]);
      }

      return {
        edges: applyEdgeChanges(edgeChanges, state.edges),
      };
    });
  },
});
