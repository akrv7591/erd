import { StateCreator } from "zustand";
import { DiagramStore } from "@/stores/diagram-store/DiagramStore";
import { applyNodeChanges, NodeAddChange, NodeChange } from "@xyflow/react";
import { NodeType } from "@/types/diagram";
import { NODE_TYPES } from "@/screens/Diagram/Main/NodeTypes";
import { EntityUtils } from "@/utility/EntityUtils";
import {BROADCAST} from "@/namespaces";

interface NodeSliceState {
  nodes: NodeType[];
}

interface NodeStoreAction {
  handleNodeChanges: (nodeChanges: NodeChange<NodeType>[]) => void;
  updateNodeData: <T extends NodeType["data"]>(
    id: string,
    dataUpdate: Partial<T> | ((data: T) => Partial<T>),
    broadcast?: boolean
  ) => void;
  addNode: (node: NodeType) => void;
}

export type NodeSlice = NodeSliceState & NodeStoreAction;

const initialStore: NodeSliceState = {
  nodes: [],
};

export const nodeSlice: StateCreator<DiagramStore, [], [], NodeSlice> = (
  set,
) => ({
  ...initialStore,


  // Actions
  handleNodeChanges: (nodeChanges) => {
    set((state) => {
      const changesToWebrtcBroadcast: NodeChange<NodeType>[] = [];
      const changesToBroadcast: NodeChange<NodeType>[] = []

      nodeChanges.forEach((nodeChange) => {
        switch (nodeChange.type) {
          case "position":
            changesToWebrtcBroadcast.push(nodeChange);
            break;
          case "remove":
            changesToBroadcast.push(nodeChange);
            changesToWebrtcBroadcast.push(nodeChange);
            break;
        }
      });

      if (changesToBroadcast.length > 0 || changesToWebrtcBroadcast.length > 0) {
        state.webrtc.broadcastData([
          {
            type: BROADCAST.DATA.TYPE.REACTFLOW_NODE_CHANGE,
            value: changesToBroadcast,
            server: true
          },{
            type: BROADCAST.DATA.TYPE.REACTFLOW_NODE_CHANGE,
            value: changesToWebrtcBroadcast,
          }
        ]);
      }

      return {
        nodes: applyNodeChanges<NodeType>(nodeChanges, state.nodes),
      };
    });
  },
  updateNodeData: (id, dataUpdate, broadcast = true) =>
    set((state) => {
      return {
        nodes: state.nodes.map((node) => {
          if (node.id !== id) {
            return node;
          }

          switch (node.type) {
            case NODE_TYPES.ENTITY:
              node = EntityUtils.getUpdatedEntityData(node, dataUpdate as any);
              break;
            default:
              throw new Error("Unknown node type");
          }

          if (broadcast) {
            state.webrtc.broadcastData([
              {
                type: BROADCAST.DATA.TYPE.NODE_DATA_UPDATE,
                value: {
                  id,
                  data: node.data,
                },
                server: true,
              },
            ]);
          }

          return node;
        }),
      };
    }),
  addNode: (node) =>
    set((state) => {
      const nodeAddBroadcast: NodeAddChange<NodeType>[] = [{
        item: node,
        type: "add",
      }];
      state.webrtc.broadcastData([
        {
          type: BROADCAST.DATA.TYPE.REACTFLOW_NODE_CHANGE,
          value: nodeAddBroadcast,
          server: true,
        },
      ]);

      return {
        nodes: [...state.nodes, node],
      };
    }),
});
