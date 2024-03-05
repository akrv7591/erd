import {useNodeId, useNodesData} from "@xyflow/react";
import {NodeType} from "@/types/table-node";

export const useNodeData = () => {
  const nodeId = useNodeId()

  if (!nodeId) return

  return useNodesData<NodeType>(nodeId)
}
