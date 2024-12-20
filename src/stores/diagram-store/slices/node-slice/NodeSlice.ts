import {StateCreator} from "zustand";
import {DiagramStore} from "@/stores/diagram-store/DiagramStore";
import {applyNodeChanges, NodeChange, NodePositionChange, ReactFlowProps} from "@xyflow/react";
import {NodeType} from "@/types/diagram";
import {REACTFLOW} from "@/namespaces/broadcast/reactflow";

interface NodeSliceState {
  nodes: NodeType[];
  nodesPositionsBeforeDragStart: REACTFLOW.NODE_CHANGE[] | null
  nodeViewportChange: number
}

interface NodeStoreAction {
  handleNodeChanges: (nodeChanges: NodeChange<NodeType>[]) => void;
  handleNodeDragStart: ReactFlowProps['onNodeDragStart']
  handleNodeDragStop: ReactFlowProps['onNodeDragStop']
  requestNodesDelete: (nodes: NodeType[]) => Promise<boolean>
}

export type NodeSlice = NodeSliceState & NodeStoreAction;

const initialStore: NodeSliceState = {
  nodes: [],
  nodeViewportChange: new Date().getTime(),
  nodesPositionsBeforeDragStart: null
};

export const nodeSlice: StateCreator<DiagramStore, [], [], NodeSlice> = (
  set,
) => ({
  ...initialStore,


  // Actions
  handleNodeChanges: (nodeChanges) => {
    set((state) => {
      const isDimensionChanged = nodeChanges.some(({type}) => type === "dimensions");
      return {
        nodes: applyNodeChanges<NodeType>(nodeChanges, state.nodes),
        ...isDimensionChanged && {nodeViewportChange: new Date().getTime()},
      };
    });
  },

  handleNodeDragStart: (event, node, nodes) => {
    const beforeChange: NodePositionChange[] = nodes.map(node => ({
      id: node.id,
      type: "position",
      position: node.position
    }))

    set({
      nodesPositionsBeforeDragStart: [{
        type: REACTFLOW.TYPE.NODE_CHANGE,
        value: beforeChange
      }]
    })
  },

  handleNodeDragStop: (event, node, nodes) => {
    const afterChange: NodePositionChange[] = nodes.map(node => ({
      id: node.id,
      type: "position",
      position: node.position,
      dragging: false
    }))

    const publishData: REACTFLOW.NODE_CHANGE[] = [{
      type: REACTFLOW.TYPE.NODE_CHANGE,
      value: afterChange
    }]

    set(state => {
      if (!state.nodesPositionsBeforeDragStart) {
        throw new Error("nodesPositionsBeforeDragStart should be set on nodesDragStart")
      }
      state.pushUndo({
        undo: state.nodesPositionsBeforeDragStart,
        redo: publishData
      })

      state.socket.broadcastData(publishData)

      return {
        nodesPositionsBeforeDragStart: null,
        nodeViewportChange: new Date().getTime()
      }
    })
  },
  requestNodesDelete: (nodes) => new Promise((resolve) => {
    set(state => {
      const message =
        nodes.length > 1
          ? "Are you sure to delete all selected nodes"
          : "Are you sure to delete selected node";
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
      }
    })
  })
});
