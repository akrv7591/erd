import {DiagramStore} from "@/stores/diagram-store";
import {REACTFLOW} from "@/namespaces/broadcast/reactflow";
import {applyEdgeChanges, applyNodeChanges} from "@xyflow/react";
import {NodeType} from "@/types/diagram";

export class ReactflowUtils {
  static updateNodes(updatedState: Partial<DiagramStore>, state: DiagramStore, data: REACTFLOW.NODE_CHANGE['value']) {
    if (!updatedState.nodes) {
      updatedState.nodes = state.nodes
    }

    const isDragEnd = data.some((node) => {
      if (node.type !== "position") {
        return false
      }

      return !node.dragging
    })

    if (isDragEnd) {
      updatedState.nodeViewportChange = new Date().getTime()
    }
    updatedState.nodes = applyNodeChanges<NodeType>(data, updatedState.nodes)
  }

  static updateEdges(updatedState: Partial<DiagramStore>, state: DiagramStore, data: REACTFLOW.EDGE_CHANGE['value']) {
    if (!updatedState.edges) {
      updatedState.edges = state.edges
    }

    updatedState.edges = applyEdgeChanges(data, updatedState.edges)
  }
}
