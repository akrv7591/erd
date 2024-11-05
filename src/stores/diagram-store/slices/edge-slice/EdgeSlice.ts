import { StateCreator } from "zustand";
import { DiagramStore } from "@/stores/diagram-store/DiagramStore.ts";
import { applyEdgeChanges, Edge, EdgeChange } from "@xyflow/react";
import {BROADCAST} from "@/namespaces";

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
        state.webrtc.broadcastData([
          {
            type: BROADCAST.DATA.TYPE.REACTFLOW_EDGE_CHANGE,
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
